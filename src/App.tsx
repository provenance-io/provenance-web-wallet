import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { useAccount, useSettings, useWalletConnect } from 'redux/hooks';
import { routes } from 'routes';

function App() {
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    pullInitialAccountData,
  } = useAccount();
  const {
    connector,
    createConnectionTimer,
    pullInitialWCData,
    connectionEST,
    connectionEXP,
    connectionTimer,
    walletconnectDisconnect,
  } = useWalletConnect();
  const { pullInitialSettingsData } = useSettings();

  // Check for an active walletconnect session, start the log-off timer if it doesn't exist
  useEffect(() => {
    if (connectionEXP) {
      const now = Date.now();
      // When is the current session expiring
      const timeoutDuration = connectionEXP - now;
      // Does an active wc connection exist with no running timer?
      if (timeoutDuration > 1 && !connectionTimer) {
        // Create and start the timer
        const callback = () => {
          // Timeout reached, disconnect the session
          walletconnectDisconnect()
        };
        createConnectionTimer({ callback, duration: timeoutDuration})
      }
    }
  }, [
    connectionEST,
    connectionEXP,
    connectionTimer,
    createConnectionTimer,
    walletconnectDisconnect,
  ]);

  useEffect(() => {
    // If we have a connector, listen for the disconnect event
    if (connector) connector.on('disconnect', async () => { walletconnectDisconnect(); });
  }, [connector, walletconnectDisconnect]);

  // If this is the initialLoad, get and set the storage wallet values
  // This happens everytime the popup is opened and closed
  useEffect(() => {
    if (initialLoad) {
      // No longer initial load
      setInitialLoad(false);
      // Note: All of these pull data functions are async
      // Pull account data from chrome storage (accounts, activeAccountId, key)
      pullInitialAccountData();
      // Pull all settings from chrome storage (unlockEST, unlockEXP, unlockDuration)
      pullInitialSettingsData();
      // Pull all walletconnect data from chrome storage and localstorage
      // - Chrome storage (connectionEST, connectionEXP, connectionDuration, pendingRequests, totalPendingRequests)
      // - Window localstorage (session)
      pullInitialWCData();
    }
  }, [initialLoad, pullInitialAccountData, pullInitialSettingsData, pullInitialWCData]);

  const routing = useRoutes(routes);

  // TODO: Create loading screen while data gets pulled in from storage
  return <>{initialLoad ? 'LOADING...' : routing}</>;
}

export default App;
