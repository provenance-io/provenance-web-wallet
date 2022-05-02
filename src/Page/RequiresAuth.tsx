import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from 'redux/hooks';
import { APP_URL, DASHBOARD_URL, NOTIFICATION_URL } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeAccountIndex, accounts } = useAccount();
  // Is the user on the landing page?
  const isLandingPage = location.pathname === APP_URL;
  // Is there an active wallet in this session
  const walletExists = accounts.length && accounts[activeAccountIndex] !== undefined;
  // User is only allowed to go into the app if they have a wallet active (unlocked) or they are on the landing page
  const userAllowed = walletExists || isLandingPage;
  // Send user to notifications page
  const walletConnectRequest = window?.location?.search;
  useEffect(() => {
    if (walletConnectRequest.includes('wc')) {
      navigate(`${NOTIFICATION_URL}${walletConnectRequest}`);
    }
    if (!userAllowed) navigate(APP_URL);
    else if (walletExists && isLandingPage) navigate(DASHBOARD_URL);
  }, [
    navigate,
    userAllowed,
    walletExists,
    isLandingPage,
    walletConnectRequest,
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
