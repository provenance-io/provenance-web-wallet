import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount } from 'redux/hooks';
import { APP_URL, DASHBOARD_URL, NOTIFICATION_URL, ALL_URLS } from 'consts';
import { getSettings } from 'utils';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  

  // Check settings and url search params to potentially redirect user to a new page
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location?.search);
    const walletConnectURI = urlSearchParams.get('wc');
    const redirectToURL = urlSearchParams.get('redirectTo');
    // Is the user on the landing page?
    const isLandingPage = location.pathname === APP_URL; 

    // Pull settings from storage to see if the unlock session expired (async)
    const asyncAccessCheck = async () => {
      // Get all settings
      const { unlockEST, unlockEXP } = await getSettings();
      // Current time
      const now = Date.now();
      // Check the unlockSession
      const unlocked = (unlockEST && unlockEXP && now < unlockEXP);
      // If we have an active account, and it's unlocked, send them to the dashboard instead of the landing page
      if (unlocked && activeAccount && isLandingPage) navigate(DASHBOARD_URL);
      // Not unlocked, previous session is now expired, or no active account - send them to the landing page
      else if (!unlocked || !activeAccount) {
        // Send user to the landing page which will ask to unlock
        navigate(`${APP_URL}${urlSearchParams}`);
      } else {
        // User has access to account and app, check for redirect or walletConnect uri search params
        // New walletconnect session request
        if (walletConnectURI) {
          navigate(`${NOTIFICATION_URL}?wc=${encodeURIComponent(walletConnectURI)}`);
        } else if (redirectToURL) {
          // Redirect user to specific page (other notifications)
          const existingURL = ALL_URLS[redirectToURL as keyof typeof ALL_URLS];
          // Make sure url exists (don't allow random redirects to non-existing pages)
          if (existingURL) navigate(existingURL);
        }
      }
    };
    // Check the users credentials/access before auto-redirecting them as needed
    asyncAccessCheck();

  }, [
    navigate,
    activeAccount,
    location.pathname,
  ]);

  return (
    activeAccount ? (
      <>
        <Outlet />
        {children}
      </>
    ) : null
  );
};
