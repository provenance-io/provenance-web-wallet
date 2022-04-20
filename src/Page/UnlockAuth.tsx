import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { COLORS } from 'theme';
import { APP_URL } from 'consts';
import { getFromLocalStorage } from 'utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  children?: React.ReactNode,
}

const PageStyled = styled.div<Props>`
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

export const UnlockAuth = ({ children = null }: Props) => {
  const navigate = useNavigate();
  const localAccountData = getFromLocalStorage('provenance-web-wallet');
  const localAccountValid = localAccountData?.walletName && localAccountData?.key;
  useEffect(() => {
    if (!localAccountValid) {
      navigate(APP_URL);
    }
  }, [localAccountValid, navigate]);

  return (
    <PageStyled>
      <Outlet />
      {children}
    </PageStyled>
  );
};
