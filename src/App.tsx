import { useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import { useAccount } from 'redux/hooks';
import { routes } from "routes";
import { getSavedData } from 'utils';

function App() {
  const { initialLoad, setInitialValues } = useAccount();

  // If this is the initialLoad, get and set the storage wallet values
  useEffect(() => {
    if (initialLoad) {
      const asyncStorageGet = async () => {
        const accounts = await getSavedData('accounts');
        const activeAccountIndex = await getSavedData('activeAccountIndex');
        console.log('accounts :', accounts);
        console.log('activeAccountIndex :', activeAccountIndex);
        setInitialValues({ accounts, activeAccountIndex });
      }
      asyncStorageGet();
    }
  }, [initialLoad, setInitialValues]);

  const routing = useRoutes(routes);
  return <>{routing}</>;
}

export default App;
