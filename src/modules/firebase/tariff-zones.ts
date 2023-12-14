import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from './firebase';
import { TariffZone, tariffZoneSchema } from './types';

export async function getTariffZones() {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'referenceData');

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const tariffZonesFromFirebase = data.tariffZones;

    const potential = JSON.parse(tariffZonesFromFirebase);
    const result: TariffZone[] = [];
    potential.forEach((tariffZone: any) => {
      const validated = tariffZoneSchema.safeParse(tariffZone);
      if (validated.success) {
        result.push(validated.data);
      }
    });

    return result;
  }
  return [];
}
