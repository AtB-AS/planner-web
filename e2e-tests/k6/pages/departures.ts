import { Locator, Page } from 'k6/browser';

export class Departures {
  constructor(private page: Page) {}

  // ### Return test-id locators ####
  get nextEstimatedCalls(): Locator {
    return this.page.locator('[data-testid="nextEstimatedCalls"]');
  }
  get departuresList(): Locator {
    return this.page.locator('[data-testid="estimatedCallsList"]');
  }
  get findDeparturesButton(): Locator {
    return this.page.locator('[data-testid="findDeparturesButton"]');
  }
  get mapContainer(): Locator {
    return this.page.locator('[data-testid="mapContainer"]');
  }
  getDeparture(quay: string, index: number = 0): Locator {
    return this.page
      .locator(`[data-testid="estimatedCallItem-${quay}"]`)
      .nth(index);
  }
  get getNearbyStopPlaces() {
    return this.page.locator(`[data-testid="list-item-stop-place"]`);
  }

  // Return the departure time for a departure
  async getDepartureTime(quay: string, index: number = 0) {
    const departure = this.page
      .locator(`[data-testid="estimatedCallItem-${quay}"]`)
      .nth(index);
    const depTime = departure.locator(`[data-testid="departureTime"]`);
    await depTime.waitFor({ state: 'visible' });
    return ((await depTime.textContent()) ?? '').trim();
  }

  // Return all quay names for the stop place
  async getQuayNames() {
    const depLists = await this.departuresList.all();
    const names = [];
    for (const list of depLists) {
      names.push(
        (await list.locator(`[data-testid="quayName"]`).textContent()) ?? '',
      );
    }
    return names;
  }

  // Return the stop place name
  async getStopPlaceName() {
    const map = this.mapContainer;
    await map.waitFor({ state: 'visible' });
    return (
      (await map.locator('[data-testid="stopPlaceName"]').textContent()) ?? ''
    );
  }

  // Return the stop place name of nearby stop places
  async getNearbyStopPlaceName(index: number = 0) {
    const nearbyStopPlaces = this.getNearbyStopPlaces.nth(index);
    await nearbyStopPlaces.waitFor({ state: 'visible' });
    return (
      (await nearbyStopPlaces
        .locator('[data-testid="stopPlaceName"]')
        .textContent()) ?? ''
    );
  }

  // Return address on top of the map
  async getAddressName() {
    const map = this.mapContainer;
    await map.waitFor({ state: 'visible' });
    return (
      (await map.locator('[data-testid="addressName"]').textContent()) ?? ''
    );
  }
}
