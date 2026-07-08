import { GlobalMessageSchema, GlobalMessageType } from '@atb-as/utils';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export const globalMessageConverter = {
  toFirestore(_any: any) {
    throw new Error('Not implemented or used');
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<any>,
  ): GlobalMessageType | undefined {
    const data = snapshot.data();
    return mapToGlobalMessage(snapshot.id, data);
  },
};

function mapToGlobalMessage(
  id: string,
  result: any,
): GlobalMessageType | undefined {
  if (!result) return;
  result.id = id;
  result.endDate = firestoreTimestampToMillis(result.endDate);
  result.startDate = firestoreTimestampToMillis(result.startDate);

  const parseResult = GlobalMessageSchema.safeParse(result);

  if (!parseResult.success) {
    console.warn(
      `GlobalMessageRaw validation failed for id: ${id}, errors: ${JSON.stringify(
        parseResult.error.message,
      )}`,
    );
    return;
  }
  return parseResult.data;
}

function firestoreTimestampToMillis(timestamp: any) {
  return timestamp?.toMillis?.();
}
