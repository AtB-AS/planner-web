/**
 * This is not a real test, its more a tool. we are making use out of playwright's screenshot capabilities.
 * It captures screenshots of the widget for easy comparison of its visual appearance.
 * It is intended for visual inspection rather than automated verification. (Ai can also make use of these screenshots for comparison.)
 * Builds the widgets and captures screenshots of them.
 * Mobile view and desktop view are captured.
 * Additionally, we capture screenshots of the assistant and departures pages for comparison.
 *
 */

import { test, expect, type Locator } from '@playwright/test';
import { decompressFromEncodedURIComponent } from 'lz-string';
import fs from 'fs';
import path from 'path';

const rootDir = path.join(__dirname, '..');
const screenshotDir = path.join(rootDir, 'widget-screenshots');
const widgetOrigin = 'http://widget.test';
// The assistant is screenshotted from the already running app, so it only
// shows the org that app was started with.
const assistantUrl = process.env.E2E_URL ?? 'http://localhost:3000';

// Norwegian locale so date and time inputs are formatted the same in the
// widget and the assistant.
test.use({ locale: 'nb-NO' });

// The screenshots are for comparing styling, so one browser is enough.
// They would also overwrite each other, since the filenames don't include
// the browser.
test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Widget screenshots are only taken in Chromium',
);

// Only take screenshots when run through `pnpm screenshot-widgets`, so they
// aren't taken as part of the regular e2e tests.
test.skip(!process.env.WIDGET_BUILD_DIR, 'Run via pnpm screenshot-widgets');

type WidgetBuild = {
  name: string;
  dir: string;
};

// `pnpm screenshot-widgets` builds the widgets from source into
// WIDGET_BUILD_DIR/<orgId>. Otherwise the latest checked-in version of
// each org's widget is used.
function getWidgetBuilds(): WidgetBuild[] {
  const buildDir = process.env.WIDGET_BUILD_DIR;
  if (buildDir) {
    return fs.readdirSync(buildDir).map((orgId) => ({
      name: orgId,
      dir: path.join(buildDir, orgId),
    }));
  }

  const availableWidgetsDir = path.join(
    rootDir,
    'src/page-modules/widget/available-widgets',
  );
  return fs.readdirSync(availableWidgetsDir).map((compressedOrgId) => {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(availableWidgetsDir, compressedOrgId, 'manifest.json'),
        'utf8',
      ),
    );
    const version: string = manifest.latest.version;
    return {
      name: `${decompressFromEncodedURIComponent(compressedOrgId)}-${version}`,
      dir: path.join(rootDir, 'public/widget', compressedOrgId, version),
    };
  });
}

/**
 * Mimic the assistant page, which shows its form as a white card on a grey background,
 * so the screenshots can be more easily compared side by side.
 * `tabClass` adds the departures page's framing, which differs from the
 * assistant's on mobile.
 */
const widgetPage = (tabClass: string) => `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="/planner-web.css" />
      <style>

        body { margin: 0; }
        #planner-widget {
          display: flow-root;
          background-color: #eef3f6;
        }
        /* spacing.large margin and spacing.xLarge padding. */
        #planner-widget > div {
          margin-top: 20px;
          padding: 24px;
          background-color: #ffffff;
          border-radius: 8px;
        }
        /* On mobile the assistant adds a spacing.medium grey frame. Its root
           font size is 14px there, so the spacing tokens (medium, large,
           xLarge) come out as 10.5px, 17.5px and 21px. */
        @media (max-width: 650px) {
          #planner-widget {
            padding: 10.5px;
          }
          #planner-widget > div {
            margin-top: 17.5px;
            padding: 21px;
            border-radius: 7px 7px 0 0;
          }
        }
        /* On mobile the departures page's card has all corners rounded. */
        @media (max-width: 650px) {
          .departures #planner-widget > div {
            border-radius: 7px;
          }
        }
      </style>
    </head>
    <body class="${tabClass}">
      <div id="planner-widget"></div>
      <script src="/planner-web.umd.js"></script>
      <script>
        const widget = window.PlannerWeb.createWidget({
          urlBase: '${widgetOrigin}',
          language: 'nb',
          outputOverrideOptions: { layoutMode: 'doubleColumn' },
        });
        document.querySelector('#planner-widget').innerHTML = widget.output;
        widget.init();
      </script>
    </body>
  </html>`;

// The widget fills the width it is given by the embedding site, so it gets
// the same width as the assistant's form. On desktop the assistant page has
// 1.5rem (spacing.xLarge) side padding around the form.
const viewports = [
  { suffix: '', width: 1024, widgetWidth: 976 },
  { suffix: '-mobile', width: 375, widgetWidth: 375 },
];

// The tabs at the top of the widget and the assistant. The trip search tab
// is selected by default. `path` is the tab's page in the assistant, and
// `widgetPrefix` is the prefix of the tab's form element ids in the widget.
const tabs = [
  {
    suffix: '',
    name: null,
    path: '/',
    className: '',
    widgetPrefix: 'pw-assistant',
  },
  {
    suffix: '-departures',
    name: 'Se avganger',
    path: '/departures',
    className: 'departures',
    widgetPrefix: 'pw-departures',
  },
];

// Waits until the element has stopped resizing, e.g. after an expand animation.
async function waitForStableSize(locator: Locator) {
  let previous = '';
  await expect
    .poll(async () => {
      const box = JSON.stringify(await locator.boundingBox());
      const stable = box === previous;
      previous = box;
      return stable;
    })
    .toBe(true);
}

for (const { name, dir } of getWidgetBuilds()) {
  for (const viewport of viewports) {
    for (const tab of tabs) {
      const screenshotName = `${name}${tab.suffix}${viewport.suffix}`;
      const widgetWidth = viewport.widgetWidth;

      test(`should render ${name} widget${tab.suffix} at ${widgetWidth}px`, async ({
        page,
      }, testInfo) => {
        // Serve the widget files straight from disk, falling back to public/
        // for assets like icons that the widget loads from its urlBase.
        await page.route(`${widgetOrigin}/**`, (route) => {
          const { pathname } = new URL(route.request().url());
          if (pathname === '/') {
            return route.fulfill({
              contentType: 'text/html',
              body: widgetPage(tab.className),
            });
          }
          const file = [
            path.join(dir, pathname),
            path.join(rootDir, 'public', pathname),
          ].find((candidate) => fs.existsSync(candidate));
          return file
            ? route.fulfill({ path: file })
            : route.fulfill({ status: 404 });
        });

        await page.setViewportSize({
          width: widgetWidth,
          height: 900,
        });
        await page.goto(widgetOrigin);

        const widget = page.locator('#planner-widget');
        await expect(widget.locator('form').first()).toBeVisible();

        if (tab.name) {
          await widget.getByRole('link', { name: tab.name }).click();
          await expect(widget.locator('#pw-departures form')).toBeVisible();
        }

        // Select "Avreise" so the date and time inputs are shown.
        await widget.locator(`#${tab.widgetPrefix}-depart`).click();
        await expect(
          widget.locator(`#${tab.widgetPrefix}-searchTimeSelector-date`),
        ).toBeVisible();

        const screenshot = await widget.screenshot({
          path: path.join(screenshotDir, `${screenshotName}.png`),
        });
        await testInfo.attach(screenshotName, {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    }
  }
}

// Screenshot the assistant's search form for comparing styling with the widget.
test.describe('assistant', () => {
  for (const viewport of viewports) {
    for (const tab of tabs) {
      const screenshotName = `assistant${tab.suffix}${viewport.suffix}`;

      test(`should render assistant${tab.suffix} at ${viewport.width}px`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: 900 });
        // Go straight to the tab's page, since clicking the tab animates the
        // underline over to it.
        await page.goto(new URL(tab.path, assistantUrl).href);

        const form = page.locator('main form').first();
        await expect(form).toBeVisible();

        // Select "Avreise" so the date and time inputs are shown, and wait
        // for them to finish expanding.
        await form.getByTestId('searchTimeSelector-avreise').click();
        await expect(form.getByTestId('searchTimeSelector-time')).toBeVisible();
        await waitForStableSize(form);

        // The departures form spans the whole page with the card centered in
        // it, while the trip search form is only as wide as the card. Crop to
        // the same width so both pages are framed the same.
        const box = (await form.boundingBox())!;
        const screenshot = await page.screenshot({
          path: path.join(screenshotDir, `${screenshotName}.png`),
          clip: {
            x: box.x + (box.width - viewport.widgetWidth) / 2,
            y: box.y,
            width: viewport.widgetWidth,
            height: box.height,
          },
        });
        await testInfo.attach(screenshotName, {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    }
  }
});
