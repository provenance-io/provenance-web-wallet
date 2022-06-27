import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { COLORS } from 'theme';
import { NEW_ACCOUNT_CREATE_URL, NEW_ACCOUNT_RECOVER_URL, NEW_ACCOUNT_ADD_URL } from 'consts';
import { useAccount } from 'redux/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  children?: React.ReactNode,
  flowType: 'create' | 'add' | 'recover';
}

const PageStyled = styled.div`
  align-items: flex-start;
  background: ${COLORS.BACKGROUND_1};
  background-size: cover;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', 'sans-serif';
  justify-content: flex-start;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  overflow: auto;
  padding: 42px 32px;
  text-align: 'left';
  z-index: 10;
`;

// Use this page wrapper to make sure the user isn't somehow skipping around the new account creation flow
// TempAccount must exist or else we redirect the user back to the new account landing page
export const NewAccountAuth = ({ children = null, flowType }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const newAccountLandingPages = useMemo(() => ({
    add: NEW_ACCOUNT_ADD_URL,
    create: NEW_ACCOUNT_CREATE_URL,
    recover: NEW_ACCOUNT_RECOVER_URL,
  }), []);
  // Are we already on a landing page
  const isNewAccountLandingPage = Object.values(newAccountLandingPages).includes(location.pathname);
  const { tempAccount } = useAccount();
  useEffect(() => {
    // If we don't have any tempAccount data and we're not already on the landing page redirect to the new account landing page
    if (!tempAccount && !isNewAccountLandingPage) {
      navigate(newAccountLandingPages[flowType]);
    }
  }, [tempAccount, navigate, isNewAccountLandingPage, flowType, newAccountLandingPages]);

  return (
    !!tempAccount || isNewAccountLandingPage ? (
    <PageStyled>
      <Outlet />
      {children}
    </PageStyled>
    ) : null
  );
};
