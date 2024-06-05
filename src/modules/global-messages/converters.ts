import { isArray } from 'lodash';
import { GlobalMessageContextEnum, GlobalMessageType } from './types';
import { MessageMode } from '@atb/components/message-box';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { LocalizedString } from '@atb/translations/commons';

export function mapToLocalizedStringArray(
  data: any,
): LocalizedString[] | undefined {
  if (!data) return;
  if (!isArray(data)) return;

  return data
    .map((ls: any) => mapToLocalizedString(ls))
    .filter((lv): lv is LocalizedString => !!lv);
}

function mapToLocalizedString(data: any): LocalizedString | undefined {
  if (!data) return;
  if (data.lang != 'nob' && data.lang != 'eng' && data.lang != 'nno') return;

  return {
    lang: data.lang,
    value: data.value,
  };
}

function mapToContexts(data: any): GlobalMessageContextEnum[] | undefined {
  if (!isArray(data)) return;

  return data
    .map((context: any) => mapToContext(context))
    .filter(Boolean) as GlobalMessageContextEnum[];
}

function mapToContext(data: any): GlobalMessageContextEnum | undefined {
  if (!Object.values(GlobalMessageContextEnum).includes(data)) return;
  return data as GlobalMessageContextEnum;
}

function mapToMessageType(type: any) {
  if (typeof type !== 'string') return;

  const options = ['info', 'valid', 'warning', 'error'];
  if (!options.includes(type)) return;
  return type as MessageMode;
}

export const globalMessageConverter = {
  toFirestore(_any: any) {
    throw new Error('Not implemented or used');
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<GlobalMessageType>,
  ): GlobalMessageType | undefined {
    const data = snapshot.data();

    if (!hasNecessaryGlobalMessageTypeFields(data)) {
      return undefined;
    }

    const active = data.active;
    const body = mapToLocalizedStringArray(data.body);
    const title = mapToLocalizedStringArray(data.title);
    const context = mapToContexts(data.context);
    const type = mapToMessageType(data.type);
    const subtle = data.subtle ?? false;
    const isDismissable = data.isDismissable ?? false;
    const startDate = data.startDate;
    const endDate = data.endDate;

    if (!body || !context || !type) return;

    return {
      id: snapshot.id,
      type,
      subtle,
      active,
      context,
      body,
      title,
      isDismissable,
      startDate,
      endDate,
    };
  },
};

function hasNecessaryGlobalMessageTypeFields(data: any) {
  return (
    'active' in data && 'body' in data && 'context' in data && 'type' in data
  );
}
