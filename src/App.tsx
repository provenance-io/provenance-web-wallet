import { useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import { useAccount, useWalletConnect } from 'redux/hooks';
import { routes } from "routes";
import { getSavedData, getWalletConnectStorage } from 'utils';

function App() {
  const { initialLoad, setInitialValues } = useAccount();
  const { setSession } = useWalletConnect();

  // If this is the initialLoad, get and set the storage wallet values
  useEffect(() => {
    if (initialLoad) {
      const asyncStorageGet = async () => {
        const accounts = await getSavedData('accounts');
        const activeAccountIndex = await getSavedData('activeAccountIndex');
        setInitialValues({ accounts, activeAccountIndex });
      }
      asyncStorageGet();
    }
  }, [initialLoad, setInitialValues]);

  // Check for any changes to the walletconnect session
  useEffect(() => {
    const walletConnectData = getWalletConnectStorage();
    if (Object.keys(walletConnectData).length) {
      console.log('App.tsx | useEffect | walletConnectData: ', walletConnectData);
      setSession(walletConnectData);
    }
  }, [ setSession ]);

  const routing = useRoutes(routes);
  return <>{routing}</>;
}

export default App;
