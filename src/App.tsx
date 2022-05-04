import { useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import { useAccount, useWalletConnect } from 'redux/hooks';
import { routes } from "routes";
import { getSavedData, getWalletConnectStorage } from 'utils';

function App() {
  const { initialLoad, setInitialValues } = useAccount();
  const { setSession } = useWalletConnect();

  // If this is the initialLoad, get and set the storage wallet values
  // This happens everytime the popup is opened and closed
  // Use this to restore a walletConnect session from localStorage data (if it exists)
  useEffect(() => {
    if (initialLoad) {
      // ----------------------------------------
      // Get saved account data from storage
      // ----------------------------------------
      console.log('App.tsx | useEffect | initialLoad');
      const asyncStorageGet = async () => {
        const accounts = await getSavedData('accounts');
        const activeAccountIndex = await getSavedData('activeAccountIndex');
        setInitialValues({ accounts, activeAccountIndex });
      }
      asyncStorageGet();
      // ---------------------------------------------
      // Restore WalletConnect session if it exists
      // ---------------------------------------------
      const walletConnectData = getWalletConnectStorage();
      if (Object.keys(walletConnectData).length) {
        console.log('App.tsx | useEffect | walletConnectData: ', walletConnectData);
        setSession(walletConnectData);
      }
    }
  }, [initialLoad, setInitialValues, setSession]);

  const routing = useRoutes(routes);
  return <>{routing}</>;
}

export default App;
