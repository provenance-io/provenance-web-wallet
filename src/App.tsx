import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { useAccount, useSettings, useWalletConnect } from 'redux/hooks';
import { routes } from 'routes';
import { NOTIFICATION_URL } from 'consts';
import { useNavigate } from 'react-router-dom';
import { Content, Loading } from 'Components';
import { Page } from 'Page';

function App() {
  const [allInitialDataLoaded, setAllInitialDataLoaded] = useState(false);
  const { pullInitialAccountData, initialDataPulled: initialAccountDataPulled } =
    useAccount();
  const {
    connector,
    createConnectionTimer,
    pullInitialWCData,
    connectionEST,
    connectionEXP,
    connectionTimer,
    walletconnectDisconnect,
    initialDataPulled: initialWCDataPulled,
  } = useWalletConnect();
  const {
    pullInitialSettingsData,
    initialDataPulled: initialSettingsDataPulled,
    initialAppLoad,
    setInitialAppLoad,
  } = useSettings();
  const navigate = useNavigate();

  // Check if the app is still loading on startup
  useEffect(() => {
    // Check to see that all initial data pulls have finished
    const hasInitialDataLoaded =
      initialAccountDataPulled && initialSettingsDataPulled && initialWCDataPulled;
    setAllInitialDataLoaded(hasInitialDataLoaded);
  }, [initialAccountDataPulled, initialSettingsDataPulled, initialWCDataPulled]);

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
          walletconnectDisconnect();
        };
        createConnectionTimer({ callback, duration: timeoutDuration });
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
    if (connector)
      connector.on('disconnect', async () => {
        walletconnectDisconnect();
      });
  }, [connector, walletconnectDisconnect]);

  // If this is the initialLoad, get and set the storage wallet values
  // This happens everytime the popup is opened and closed
  useEffect(() => {
    if (initialAppLoad) {
      // No longer initial load
      setInitialAppLoad(false);
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
  }, [
    initialAppLoad,
    setInitialAppLoad,
    pullInitialAccountData,
    pullInitialSettingsData,
    pullInitialWCData,
  ]);

  // Check settings and url search params to potentially redirect user to a new page
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location?.search);
    const walletConnectURI = urlSearchParams.get('wc');
    const walletConnectDuration = urlSearchParams.get('duration');
    const walletConnectReferral = urlSearchParams.get('referral');
    const redirectToURL = urlSearchParams.get('redirectTo');
    // Determine if we're being sent to the notifications page (walletconnect session or manual redirect)
    const redirectToNotificationsPage: boolean =
      !!walletConnectURI ||
      !!(redirectToURL && redirectToURL === 'NOTIFICATION_URL');
    if (redirectToNotificationsPage) {
      const wcDuration = walletConnectDuration
        ? `&duration=${walletConnectDuration}`
        : '';
      const wcParam = walletConnectURI
        ? `?wc=${encodeURIComponent(walletConnectURI)}`
        : '';
      const wcReferral = walletConnectReferral
        ? `&referral=${encodeURIComponent(walletConnectReferral)}`
        : '';
      const newUrl = `${wcParam}${wcDuration}${wcReferral}`;
      navigate(`${NOTIFICATION_URL}${newUrl}`);
    }
  }, [navigate]);

  const routing = useRoutes(routes);

  return allInitialDataLoaded ? (
    routing
  ) : (
    <Page bgImage>
      <Content>
        <Loading fullscreen />
      </Content>
    </Page>
  );
}

export default App;
