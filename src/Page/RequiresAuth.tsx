import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useActiveAccount, useSettings } from 'redux/hooks';
import { APP_URL, DASHBOARD_URL } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const { unlockEST, unlockEXP } = useSettings();
  // Is the user on the landing page?
  const isLandingPage = location.pathname === APP_URL;

  // Check settings and url search params to potentially redirect user to a new page
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location?.search);
    // Check the users credentials/access before auto-redirecting them as needed
    // Current time
    const now = Date.now();
    // Check the unlockSession
    const unlocked = unlockEST && unlockEXP && now < unlockEXP;
    const authenticated = unlocked && activeAccount; // To get to dashboard or other pages, must be unlocked with an active account
    // Not authenticated and on non-landing page
    if (!authenticated && !isLandingPage) {
      // Send user to the landing page which will ask to unlock
      navigate(`${APP_URL}${urlSearchParams}`);
    }
    // No redirect or special action, but user is already authenticated
    else if (authenticated && isLandingPage) navigate(DASHBOARD_URL);
  }, [
    navigate,
    isLandingPage,
    activeAccount,
    location.pathname,
    unlockEST,
    unlockEXP,
  ]);

  return activeAccount || isLandingPage ? (
    <>
      <Outlet />
      {children}
    </>
  ) : null;
};
