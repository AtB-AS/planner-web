import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from './firebase';
import { DefaultFocusPoint, defaultFocusPointSchema } from './types';

const DEFAULT_FOCUS_POINT_FALLBACK = { lat: 63.43457, lon: 10.39844 };
export async function getDefaultFocusPoint(): Promise<DefaultFocusPoint> {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'other');

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    try {
      const validated = defaultFocusPointSchema.safeParse(
        data.defaultFocusPoint,
      );
      if (validated.success) {
        return validated.data;
      }
    } catch (e) {
      throw new Error('Could not parse default focus point from Firebase');
    }
  }
  return DEFAULT_FOCUS_POINT_FALLBACK;
}
