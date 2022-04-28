import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useWallet, useWalletConnect } from 'redux/hooks';
import { APP_URL, CONNECT_URL, DASHBOARD_URL } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeWalletIndex, wallets } = useWallet();
  const { createConnector, connector, setConnected, setConnectionDetails } = useWalletConnect();
  // Is the user on the landing page?
  const isLandingPage = location.pathname === APP_URL;
  const walletConnectUriParam = searchParams.get('wc');
  // Is there an active wallet in this session
  const walletExists = wallets.length && wallets[activeWalletIndex] !== undefined;
  // User is only allowed to go into the app if they have a wallet active (unlocked) or they are on the landing page
  const userAllowed = walletExists || isLandingPage;

  // On load, create the walletConnect event listeners
  useEffect(() => {
    if (connector) {
      connector.on('session_request', (error, payload) => {
        console.log('SESSION_REQUEST EVENT: ', payload, error);
        // Move the user to the connection page
        navigate(CONNECT_URL, { state: { payload }});
      });
      connector.on('connect', (error, payload) => {
        console.log('CONNECT EVENT: ', payload, error);
        setConnectionDetails(payload.params[0]);
        setConnected(true);
        // Move the user to the connection page
        navigate(DASHBOARD_URL, { state: { payload }});
      });
      connector.on('disconnect', (error, payload) => {
        setConnected(false);
        console.log('DISCONNECT EVENT: ', payload, error);
      });

      return () => {
        connector.off('session_request');
        connector.off('connect');
        connector.off('disconnect');
      }
    }
  }, [
    connector,
    navigate,
    setConnected,
    setConnectionDetails,
  ]);

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && walletConnectUriParam) {
      // Create new connector
      createConnector(walletConnectUriParam);
      // Clear out uri from search params
      setSearchParams('');
    }
  }, [connector, walletConnectUriParam, createConnector, setSearchParams]);

  useEffect(() => {
    if (!userAllowed) navigate(APP_URL);
    else if (walletExists && isLandingPage) navigate(DASHBOARD_URL);
  }, [
    navigate,
    userAllowed,
    walletExists,
    isLandingPage,
  ]);

  return (
    userAllowed ? (
      <>
        <Outlet />
        {children}
      </>
    ) : null
  );
};
