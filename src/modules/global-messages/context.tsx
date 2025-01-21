import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GlobalMessageContextEnum, GlobalMessageType } from './types';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import app from '@atb/modules/firebase/firebase';
import { getFirestore } from 'firebase/firestore';
import { globalMessageConverter } from './converters';
import useLocalStorage from '@atb/utils/use-localstorage.ts';
import { useNow } from '@atb/utils/use-now.ts';

type GlobalMessagesState = {
  activeGlobalMessages: GlobalMessageType[];
  dismissGlobalMessage: (message: GlobalMessageType) => void;
};

const GlobalMessageContext = createContext<GlobalMessagesState | undefined>(
  undefined,
);

type DismissedGlobalMessage = {
  id: string;
};

const DISMISSED_GLOBAL_MESSAGES_KEY = 'dismissedGlobalMessages';

export type GlobalMessagesContextProps = PropsWithChildren<{}>;

export function GlobalMessageContextProvider({
  children,
}: GlobalMessagesContextProps) {
  const [allGlobalMessages, setAllGlobalMessages] = useState<
    GlobalMessageType[]
  >([]);
  const [activeGlobalMessages, setActiveGlobalMessages] = useState<
    GlobalMessageType[]
  >([]);
  const [dismissedGlobalMessages, setDismissedGlobalMessages] = useLocalStorage<
    DismissedGlobalMessage[]
  >(DISMISSED_GLOBAL_MESSAGES_KEY, []);
  const now = useNow();

  useEffect(
    () => subscribeToActiveGlobalMessagesFromFirestore(setAllGlobalMessages),
    [],
  );

  useEffect(() => {
    setActiveGlobalMessages(
      allGlobalMessages
        .filter((message) => isMessageActiveAtTimestamp(message, now))
        .filter(
          (message) =>
            !message.isDismissable ||
            !dismissedGlobalMessages.some(
              (dismissedGlobalMessage) =>
                dismissedGlobalMessage.id === message.id,
            ),
        ),
    );
  }, [allGlobalMessages, dismissedGlobalMessages, now]);

  const dismissGlobalMessage = useCallback(
    (message: GlobalMessageType) => {
      if (!message.isDismissable) return;

      const currentMillis = new Date().getTime();
      const activeMessages = allGlobalMessages.filter((message) =>
        isMessageActiveAtTimestamp(message, currentMillis),
      );

      /**
       * To make sure that the list of dismissed IDs in local storage doesn't
       * grow forever, we clean up inactive global messages before adding a new one.
       */
      const updatedDismissedGlobalMessages = dismissedGlobalMessages
        .filter(
          (dismissedMessage) =>
            dismissedMessage.id !== message.id &&
            activeMessages.some(
              (activeMessage) => dismissedMessage.id === activeMessage.id,
            ),
        )
        .map((message) => ({ id: message.id }));

      setDismissedGlobalMessages(
        updatedDismissedGlobalMessages.concat({ id: message.id }),
      );
    },
    [allGlobalMessages, setDismissedGlobalMessages, dismissedGlobalMessages],
  );

  return (
    <GlobalMessageContext.Provider
      value={{
        activeGlobalMessages,
        dismissGlobalMessage,
      }}
    >
      {children}
    </GlobalMessageContext.Provider>
  );
}

function subscribeToActiveGlobalMessagesFromFirestore(
  updateActiveGlobalMessages: (
    activeGlobalMessages: GlobalMessageType[],
  ) => void,
) {
  const db = getFirestore(app);

  const q = query(
    collection(db, 'globalMessagesV2'),
    where('active', '==', true),
    where(
      'context',
      'array-contains-any',
      Object.values(GlobalMessageContextEnum),
    ),
  ).withConverter<GlobalMessageType | undefined>(globalMessageConverter);

  return onSnapshot(q, (querySnapshot) => {
    const activeGlobalMessages: GlobalMessageType[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        activeGlobalMessages.push(data);
      }
    });

    updateActiveGlobalMessages(activeGlobalMessages);
  });
}

const isMessageActiveAtTimestamp = (
  globalMessage: GlobalMessageType,
  timestampMillis: number,
) => {
  const startDate = globalMessage.startDate;
  const endDate = globalMessage.endDate;
  return (
    (!startDate || startDate.getTime() <= timestampMillis) &&
    (!endDate || endDate.getTime() >= timestampMillis)
  );
};

export function useActiveGlobalMessages(): GlobalMessagesState {
  const context = useContext(GlobalMessageContext);
  if (context === undefined) {
    throw new Error(
      'useActiveGlobalMessages must be used within a GlobalMessageContextProvider',
    );
  }
  return context;
}