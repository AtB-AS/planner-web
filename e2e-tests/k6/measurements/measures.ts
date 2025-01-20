import { Page } from 'k6/browser';

export class Measures {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async mark(label: string) {
    switch (label) {
      case 'search':
        await this.page.evaluate(() => {
          window.performance.mark('search');
        });
        break;
      case 'search-firstResult':
        await this.page.evaluate(() => {
          window.performance.mark('search-firstResult');
        });
        break;
      case 'search-lastResult':
        await this.page.evaluate(() => {
          window.performance.mark('search-lastResult');
        });
        break;
      case 'assistant-details-open':
        await this.page.evaluate(() => {
          window.performance.mark('assistant-details-open');
        });
        break;
      case 'assistant-details-opened':
        await this.page.evaluate(() => {
          window.performance.mark('assistant-details-opened');
        });
        break;
      case 'departures-details-open':
        await this.page.evaluate(() => {
          window.performance.mark('departures-details-open');
        });
        break;
      case 'departures-details-opened':
        await this.page.evaluate(() => {
          window.performance.mark('departures-details-opened');
        });
        break;
    }
  }

  async measure(label: string) {
    switch (label) {
      case 'measure-search-firstResult':
        await this.page.evaluate(() =>
          window.performance.measure(
            'measure-search-firstResult',
            'search',
            'search-firstResult',
          ),
        );
        return await this.page.evaluate(
          () =>
            JSON.parse(
              JSON.stringify(
                window.performance.getEntriesByName(
                  'measure-search-firstResult',
                ),
              ),
            )[0].duration,
        );
      case 'measure-search-lastResult':
        await this.page.evaluate(() =>
          window.performance.measure(
            'measure-search-lastResult',
            'search',
            'search-lastResult',
          ),
        );
        return await this.page.evaluate(
          () =>
            JSON.parse(
              JSON.stringify(
                window.performance.getEntriesByName(
                  'measure-search-lastResult',
                ),
              ),
            )[0].duration,
        );
      case 'measure-assistant-details-open':
        await this.page.evaluate(() =>
          window.performance.measure(
            'measure-assistant-details-open',
            'assistant-details-open',
            'assistant-details-opened',
          ),
        );
        return await this.page.evaluate(
          () =>
            JSON.parse(
              JSON.stringify(
                window.performance.getEntriesByName(
                  'measure-assistant-details-open',
                ),
              ),
            )[0].duration,
        );
      case 'measure-departures-details-open':
        await this.page.evaluate(() =>
          window.performance.measure(
            'measure-departures-details-open',
            'departures-details-open',
            'departures-details-opened',
          ),
        );
        return await this.page.evaluate(
          () =>
            JSON.parse(
              JSON.stringify(
                window.performance.getEntriesByName(
                  'measure-departures-details-open',
                ),
              ),
            )[0].duration,
        );
    }
  }
}
