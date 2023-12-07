import { getFirestore, getDoc, getDocFromCache, doc } from 'firebase/firestore';
import app from './firebase';
import { TariffZone, tariffZoneSchema } from './types';

export default async function getTariffZones() {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'referenceData');

  let snapshot;
  try {
    snapshot = await getDocFromCache(docRef);
  } catch (e) {
    snapshot = await getDoc(docRef);
  }

  if (snapshot.exists()) {
    const data = snapshot.data();
    const tariffZonesFromFirebase = data.tariffZones;

    const tariffZones = JSON.parse(tariffZonesFromFirebase);
    const result: TariffZone[] = [];
    tariffZones.forEach((tariffZone: any) => {
      const validated = tariffZoneSchema.safeParse(tariffZone);
      if (validated.success) {
        result.push(validated.data);
      }
    });
    return result;
  }
  return [];
}
