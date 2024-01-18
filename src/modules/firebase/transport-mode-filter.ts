import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from './firebase';
import { TravelSearchFilters } from '@atb-as/config-specs';

export async function getTransportModeFilter() {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'travelSearchFilters');

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();

    try {
      const validated = TravelSearchFilters.safeParse(data);
      if (validated.success) {
        return validated.data.transportModes;
      }
    } catch (e) {
      throw new Error('Could not parse travel search filters from Firebase');
    }
  }

  return [];
}
