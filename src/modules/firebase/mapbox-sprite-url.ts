import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { AppVersionedConfigurableLinkSchema } from '@atb-as/config-specs';
import app from './firebase';

export async function getMapboxSpriteUrl(): Promise<string | undefined> {
  const firestore = getFirestore(app);
  const docRef = doc(firestore, 'configuration', 'urls');
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return undefined;

  const parsed = AppVersionedConfigurableLinkSchema.array().safeParse(
    snapshot.data().mapboxSpriteUrls,
  );
  if (!parsed.success) return undefined;

  // Web has no app version — prefer the entry with no upper bound (i.e. the
  // "current" one). Fall back to the last entry in the array.
  const current =
    parsed.data.find((v) => !v.appVersionMax) ?? parsed.data.at(-1);
  return current?.configurableLink?.[0]?.value;
}
