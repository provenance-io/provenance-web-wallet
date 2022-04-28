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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeWalletIndex, wallets } = useWallet();
  const { setUri, uri } = useWalletConnect();
  const isLandingPage = location.pathname === '/';
  const walletConnectUri = searchParams.get('wc');
  const walletExists = wallets.length && wallets[activeWalletIndex] !== undefined;
  const userAllowed = walletExists || isLandingPage;

  useEffect(() => {
    if (!userAllowed) {
      navigate(APP_URL);
    }
    if (walletExists && isLandingPage) {
      navigate(DASHBOARD_URL);
    }
    if (walletExists && walletConnectUri) {
      navigate(
        {
          pathname: CONNECT_URL,
          search: `?wc=${walletConnectUri}`,
        }
        );
    }
  }, [
    navigate,
    userAllowed,
    walletExists,
    isLandingPage,
    walletConnectUri,
    setUri,
    uri,
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
