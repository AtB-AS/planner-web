import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from './firebase';
import { FareZone, fareZoneSchema } from './types';

export async function getFareZones() {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'referenceData');

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    try {
      const potential = JSON.parse(data.fareZones);
      const result: FareZone[] = [];
      potential.forEach((fareZone: any) => {
        const validated = fareZoneSchema.safeParse(fareZone);
        if (validated.success) {
          result.push(validated.data);
        }
      });

      return result;
    } catch (e) {
      throw new Error('Could not parse fare zones from firebase');
    }
  }
  return [];
}
