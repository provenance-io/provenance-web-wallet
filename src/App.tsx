import { useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import { useAccount, useWalletConnect } from 'redux/hooks';
import { routes } from "routes";
import { getSavedData, getWalletConnectStorage, removeAllPendingRequests } from 'utils';

function App() {
  const { initialLoad, setInitialValues } = useAccount();
  const { setSession, connector, killSession } = useWalletConnect();

  // TODO: Need to find a better place for these listeners
  useEffect(() => {
    if (connector) {
      // If we have a connector, listen for the disconnect event
      connector.on('disconnect', async (error, payload) => {
        // Remove all pending requests
        await removeAllPendingRequests();
        // Kill the session from walletconnect in redux store
        killSession();
      });
    }
  });

  // If this is the initialLoad, get and set the storage wallet values
  // This happens everytime the popup is opened and closed
  // Use this to restore a walletConnect session from localStorage data (if it exists)
  useEffect(() => {
    if (initialLoad) {
      // ----------------------------------------
      // Get saved account data from storage
      // ----------------------------------------
      const asyncStorageGet = async () => {
        const accounts = await getSavedData('accounts');
        const activeAccountId = await getSavedData('activeAccountId');
        // Only save if we have data
        if (accounts || activeAccountId) setInitialValues({ accounts, activeAccountId });
      }
      asyncStorageGet();
      // ---------------------------------------------
      // Restore WalletConnect session if it exists
      // ---------------------------------------------
      const walletConnectData = getWalletConnectStorage();
      if (Object.keys(walletConnectData).length) {
        setSession(walletConnectData);
      }
    }
  }, [initialLoad, setInitialValues, setSession]);

  const routing = useRoutes(routes);
  // TODO: Create loading screen while data gets pulled in from storage
  return <>{initialLoad ? 'LOADING...' : routing}</>;
}

export default App;
