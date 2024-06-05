import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GlobalMessageContextEnum, GlobalMessageType } from './types';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import app from '@atb/modules/firebase/firebase';
import { getFirestore } from 'firebase/firestore';
import { globalMessageConverter } from './converters';

type GlobalMessagesState = {
  activeGlobalMessages: GlobalMessageType[];
};

const GlobalMessageContext = createContext<GlobalMessagesState | undefined>(
  undefined,
);

export type GlobalMessagesContextProps = PropsWithChildren<{}>;
export function GlobalMessageContextProvider({
  children,
}: GlobalMessagesContextProps) {
  const [activeGlobalMessages, setActiveGlobalMessages] = useState<
    GlobalMessageType[]
  >([]);

  useEffect(() => {
    return subscribeToActiveGlobalMessagesFromFirestore(
      setActiveGlobalMessages,
    );
  }, []);

  return (
    <GlobalMessageContext.Provider
      value={{
        activeGlobalMessages,
      }}
    >
      {children}
    </GlobalMessageContext.Provider>
  );
}

export function useGlobalMessages(): GlobalMessagesState {
  const context = useContext(GlobalMessageContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalMessages must be used within a GlobalMessageContextProvider',
    );
  }
  return context;
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
    where('context', 'array-contains-any', [
      GlobalMessageContextEnum.plannerWebAssistant,
    ]),
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
