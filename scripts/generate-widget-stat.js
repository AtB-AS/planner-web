const { compareVersions } = require('compare-versions');
const { readdir, stat } = require('fs/promises');
const { join, resolve, dirname } = require('path');
const { writeFile, mkdir, readFile } = require('fs/promises');

const { compressToEncodedURIComponent } = require('lz-string');

/***
 * We need to generate manifest files to easier refer to them for widget documentation.
 * Couldn't find a way to do it with Next.js (resolving all files in public directory),
 * so generating manifest file and storing that in modules is a workaround
 */

const currentOrg = process.env.NEXT_PUBLIC_PLANNER_ORG_ID;

if (!currentOrg) {
  throw new Error('Missing env NEXT_PUBLIC_PLANNER_ORG_ID');
}

const compressedOrgId = compressToEncodedURIComponent(currentOrg);

saveManifestFile();

async function saveManifestFile() {
  const manifestFile = resolve(
    __dirname,
    `../src/page-modules/widget/available-widgets/${compressedOrgId}/manifest.json`,
  );
  const widgetData = await getWidgetData(await getExistingCreated(manifestFile));

  await mkdir(dirname(manifestFile), { recursive: true });
  await writeFile(manifestFile, JSON.stringify(widgetData, null, 2));
}

// Keep created dates from the existing manifest, as directory birthtimes
// change on every checkout.
async function getExistingCreated(manifestFile) {
  try {
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
    return new Map(manifest.all.map((w) => [w.version, w.created]));
  } catch {
    return new Map();
  }
}

async function getWidgetData(existingCreated) {
  const baseUrl = join(process.cwd(), '/public/widget', compressedOrgId);
  const dirs = await readdir(baseUrl);

  // return all files from /public/widget based on dirs
  const allP = dirs.map(async (dir) => {
    const statForDir = await stat(resolve(dir, baseUrl));
    return {
      version: dir,
      created:
        existingCreated.get(dir) ?? statForDir.birthtime.toISOString(),
      urls: {
        umd: `/widget/${compressedOrgId}/${dir}/planner-web.umd.js`,
        esm: `/widget/${compressedOrgId}/${dir}/planner-web.mjs`,
        css: `/widget/${compressedOrgId}/${dir}/planner-web.css`,
      },
    };
  });

  let all = await Promise.all(allP);
  all = all.sort((a, b) => compareVersions(a.version, b.version) * -1);

  return {
    latest: all[0],
    all,
  };
}
