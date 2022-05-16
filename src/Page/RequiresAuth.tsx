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
  // Is the user on the landing page?
  const isLandingPage = location.pathname === APP_URL;   

  // Check settings and url search params to potentially redirect user to a new page
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location?.search);
    const walletConnectURI = urlSearchParams.get('wc');
    const redirectToURL = urlSearchParams.get('redirectTo');

    // Pull settings from storage to see if the unlock session expired (async)
    const asyncAccessCheck = async () => {
      // Get all settings
      const { unlockEST, unlockEXP } = await getSettings();
      // Current time
      const now = Date.now();
      // Check the unlockSession
      const unlocked = (unlockEST && unlockEXP && now < unlockEXP);
      const authenticated = unlocked && activeAccount; // To get to dashboard or other pages, must be unlocked with an active account
      // Not authenticated and on non-landing page
      if (!authenticated && !isLandingPage) {
        // Send user to the landing page which will ask to unlock
        navigate(`${APP_URL}${urlSearchParams}`);
      }
      // User is authenticated and is on the landing page
      else if (authenticated) {
        // Check for url search params
        if (walletConnectURI) {
          // New walletconnect session request
          navigate(`${NOTIFICATION_URL}?wc=${encodeURIComponent(walletConnectURI)}`);
        } else if (redirectToURL) {
          // Redirect user to specific page (other notifications)
          const existingURL = ALL_URLS[redirectToURL as keyof typeof ALL_URLS];
          // Make sure url exists (don't allow random redirects to non-existing pages)
          if (existingURL) navigate(existingURL);
        } else if (isLandingPage) {
          // No url search params and on landing page - send them to the dashboard
          navigate(DASHBOARD_URL);
        }
      }
    };
    // Check the users credentials/access before auto-redirecting them as needed
    asyncAccessCheck();

  }, [
    navigate,
    isLandingPage,
    activeAccount,
    location.pathname,
  ]);

  return (
    activeAccount || isLandingPage ? (
      <>
        <Outlet />
        {children}
      </>
    ) : null
  );
};
