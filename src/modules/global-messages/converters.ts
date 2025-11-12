import { GlobalMessageType, globalMessageTypeSchema } from './types';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export const globalMessageConverter = {
  toFirestore(_any: any) {
    throw new Error('Not implemented or used');
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<GlobalMessageType>,
  ): GlobalMessageType | undefined {
    const data = snapshot.data();
    const potential = {
      id: snapshot.id,
      active: data.active,
      title: data.title,
      body: data.body,
      type: data.type,
      subtle: data.subtle,
      context: data.context,
      isDismissable: data.isDismissable,
      startDate: firestoreTimestampToDate(data.startDate),
      endDate: firestoreTimestampToDate(data.endDate),
      link: data.link,
      linkText: data.linkText,
    };

    const validated = globalMessageTypeSchema.safeParse(potential);

    if (validated.success) {
      return validated.data;
    }

    return undefined;
  },
};

function firestoreTimestampToDate(timestamp: any) {
  return timestamp?.toDate?.();
}
