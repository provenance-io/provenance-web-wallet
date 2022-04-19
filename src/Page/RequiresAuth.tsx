import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useWallet } from 'redux/hooks';
import { APP_URL } from 'consts';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => {
  const navigate = useNavigate();
  const { activeWalletIndex, wallets } = useWallet();
  const walletExists = wallets.length && wallets[activeWalletIndex] !== undefined;
  useEffect(() => {
    if (!walletExists) {
      navigate(APP_URL);
    }
  }, [walletExists, navigate]);

  return (
    <>
      <Outlet />
      {children}
    </>
  );
};
