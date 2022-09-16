import React, { useEffect, useMemo } from 'react';
import {
  NEW_ACCOUNT_ADD_URL,
  NEW_ACCOUNT_CREATE_URL,
  NEW_ACCOUNT_IMPORT_URL,
  NEW_ACCOUNT_RECOVER_URL,
  NEW_ACCOUNT_SUB_URL,
} from 'consts';
import { useAccount } from 'redux/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlowType } from 'types';
import { Page } from './Page';

interface Props {
  children?: React.ReactNode;
  flowType: FlowType;
}

// Use this page wrapper to make sure the user isn't somehow skipping around the new account creation flow
// TempAccount must exist or else we redirect the user back to the new account landing page
export const NewAccountAuth = ({ children = null, flowType }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const newAccountLandingPages = useMemo(
    () => ({
      sub: NEW_ACCOUNT_SUB_URL,
      create: NEW_ACCOUNT_CREATE_URL,
      recover: NEW_ACCOUNT_RECOVER_URL,
      add: NEW_ACCOUNT_ADD_URL,
      import: NEW_ACCOUNT_IMPORT_URL,
    }),
    []
  );
  // Are we already on a landing page
  const isNewAccountLandingPage = Object.values(newAccountLandingPages).includes(
    location.pathname
  );
  const { tempAccount } = useAccount();
  useEffect(() => {
    // If we don't have any tempAccount data and we're not already on the landing page redirect to the new account landing page
    if (!tempAccount && !isNewAccountLandingPage) {
      navigate(newAccountLandingPages[flowType]);
    }
  }, [
    tempAccount,
    navigate,
    isNewAccountLandingPage,
    flowType,
    newAccountLandingPages,
  ]);

  return !!tempAccount || isNewAccountLandingPage ? <Page>{children}</Page> : null;
};
