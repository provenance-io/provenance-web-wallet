import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from 'redux/hooks';
import { APP_URL, DASHBOARD_URL } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeWalletIndex, wallets } = useWallet();
  const isLandingPage = location.pathname === '/';
  const walletExists = wallets.length && wallets[activeWalletIndex] !== undefined;
  const userAllowed = walletExists || isLandingPage;
  useEffect(() => {
    if (!userAllowed) {
      navigate(APP_URL);
    }
    if (walletExists && isLandingPage) {
      navigate(DASHBOARD_URL);
    }
  }, [navigate, userAllowed, walletExists, isLandingPage]);

  return (
    userAllowed ? (
      <>
        <Outlet />
        {children}
      </>
    ) : null
  );
};
