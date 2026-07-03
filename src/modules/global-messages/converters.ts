import { QueryDocumentSnapshot } from 'firebase/firestore';
import { GlobalMessageType, GlobalMessageSchema } from './types';
import { isDefined } from '@atb/utils/presence';

export const globalMessageConverter = {
  toFirestore(_any: any) {
    throw new Error('Not implemented or used');
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<GlobalMessageType>,
  ): GlobalMessageType | undefined {
    const data = snapshot.data();
    return mapToGlobalMessage(snapshot.id, data);
  },
};

export function mapToGlobalMessages(
  result: QueryDocumentSnapshot<any>[],
): GlobalMessageType[] {
  if (!result) return [];
  return result
    .map((message) => mapToGlobalMessage(message.id, message.data()))
    .filter(isDefined);
}

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
