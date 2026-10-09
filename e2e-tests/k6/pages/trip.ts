import { Locator, Page } from 'k6/browser';

export class Trip {
  // Scope: a Page (collapsed view) or a Locator (e.g. the tripDetails container)
  constructor(private locator: Locator | Page) {}

  // ### Return test-id locators ####
  get firstLeg(): Locator {
    return this.locator.locator('[data-testid="trip-leg"]').first();
  }
  get lastLeg(): Locator {
    return this.locator.locator('[data-testid="trip-leg"]').last();
  }

  // Return the departure name of a leg of a trip
  async fromName(legLocator: Locator) {
    const from = legLocator.locator('[data-testid="legFromName"]');
    return ((await from.textContent()) ?? '').trim();
  }

  // Return the arrival name of a leg of a trip
  async toName(legLocator: Locator) {
    const to = legLocator.locator('[data-testid="legToName"]');
    return ((await to.textContent()) ?? '').trim();
  }

  // Return the departure time of a leg of a trip
  async departureTime(legLocator: Locator) {
    const time = legLocator.locator('[data-testid="departureTime"]').first();
    return ((await time.textContent()) ?? '').trim();
  }

  // Return the arrival time of a leg of a trip
  async arrivalTime(legLocator: Locator) {
    const time = legLocator.locator('[data-testid="departureTime"]').last();
    return ((await time.textContent()) ?? '').trim();
  }
}
