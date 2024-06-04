import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { GlobalMessageType } from './types';

type GlobalMessagesState = {
  activeGlobalMessages: GlobalMessageType[];
};

// Creating context
const GlobalMessageContext = createContext<GlobalMessagesState | undefined>(
  undefined,
);

// 4. Hiding context by providing wanted API.
export type GlobalMessagesContextProps = PropsWithChildren<{}>;
export function AlertContextProvider({ children }: GlobalMessagesContextProps) {
  const [alerts, setglobalMessagess] = useState(initialAlerts);

  const addAlert = useCallback((alert: Alert) => {
    const alertWithId = {
      ...alert,
      id: Date.now(),
    };
    // Insert at top
    setAlerts((all) => [alertWithId].concat(all));
    return alertWithId;
  }, []);

  const removeAlert = useCallback((alert: AlertWithId) => {
    // Filter out alert
    setAlerts((all) => all.filter((i) => i.id !== alert.id));
    return alert;
  }, []);

  const filterOldAlerts = useCallback(() => {
    // Filter out alert
    if (!alerts.length) return;
    const threshold = Date.now() - timeoutInMs;
    setAlerts((all) => all.filter((i) => i.id > threshold));
  }, [alerts.length, timeoutInMs]);

  const cleanAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  useInterval(filterOldAlerts, UPDATE_FREQUENCY_MS);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        cleanAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

// 5. Exporting context accessor
export function useAlerts(): AlertsState {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within a AlertContextProvider');
  }
  return context;
}
