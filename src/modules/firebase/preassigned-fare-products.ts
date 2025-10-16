import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from './firebase';
import {
  type PreassignedFareProduct as PreassignedFareProductType,
  PreassignedFareProduct as PreassignedFareProductSchema,
} from '@atb-as/config-specs';
import { isDefined } from '@atb/utils/presence';

/**
 * NB! This retrieves preassignedFareProducts_v2 directly from firestore instead of via sales svc.
 * Be aware - future use cases may require going through sales svc.
 * Any personalised tickets such as HjemJobbHjem need to go throug sales svc.
 */
export async function getPreassignedFareProducts(): Promise<
  PreassignedFareProductType[]
> {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'referenceData');

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    try {
      return JSON.parse(data?.preassignedFareProducts_v2)
        .map((p: any) => {
          const parsed = PreassignedFareProductSchema.safeParse(p);
          return parsed.success ? parsed.data : undefined;
        })
        .filter(isDefined);
    } catch (e) {
      throw new Error(
        'Could not parse preassigned fare products from Firebase',
      );
    }
  }

  return [];
}
