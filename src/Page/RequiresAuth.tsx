import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount } from 'redux/hooks';
import { APP_URL, DASHBOARD_URL, NOTIFICATION_URL, ALL_URLS } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  // Is the user on the landing page?
  const isLandingPage = location.pathname === APP_URL;
  // Is there an active wallet in this session
  // User is only allowed to go into the app if they have a wallet active (unlocked) or they are on the landing page
  const userAllowed = activeAccount || isLandingPage;
  // Send user to notifications page
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location?.search);
    const walletConnectURI = urlSearchParams.get('wc');
    const redirectToURL = urlSearchParams.get('redirectTo');
    if (walletConnectURI) {
      navigate(`${NOTIFICATION_URL}?wc=${encodeURIComponent(walletConnectURI)}`);
    }
    else if (redirectToURL) {
      const existingURL = ALL_URLS[redirectToURL as keyof typeof ALL_URLS];
      if (existingURL) navigate(existingURL);
    }
    else if (!userAllowed) navigate(APP_URL);
    else if (activeAccount && isLandingPage) navigate(DASHBOARD_URL);
  }, [
    navigate,
    userAllowed,
    activeAccount,
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
