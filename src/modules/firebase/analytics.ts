import {
  getAnalytics,
  isSupported,
  logEvent,
  setConsent,
} from 'firebase/analytics';
import app from './firebase';

export async function init() {
  if (!(await isSupported())) {
    return;
  }

  // Default all consents to denied.
  setConsent({
    ad_storage: 'denied',
    functionality_storage: 'denied',
    security_storage: 'denied',
    personalization_storage: 'denied',
    analytics_storage: 'denied',
  });

  // Initialize Firebase
  const analytics = getAnalytics(app);

  // Disable automatic data collection.
  analytics.app.automaticDataCollectionEnabled = false;
}

export function logSpecificEvent(
  event:
    | 'search_assistant'
    | 'search_departure'
    | 'select_search'
    | 'initialize_map',
) {
  if (!isSupported()) {
    return;
  }

  try {
    const analytics = getAnalytics(app);
    logEvent(analytics, event, {});
  } catch (e) {
    // ignore, fire and forget
  }
}
