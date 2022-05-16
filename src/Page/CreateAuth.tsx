import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { COLORS } from 'theme';
import { CREATE_URL } from 'consts';
import { useAccount } from 'redux/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

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

export const CreateAuth = ({ children = null }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateLandingPage = location.pathname === CREATE_URL;
  const { tempAccount } = useAccount();
  useEffect(() => {
    if (!tempAccount) {
      navigate(CREATE_URL);
    }
  }, [tempAccount, navigate]);

  return (
    !!tempAccount || isCreateLandingPage ? (
    <PageStyled>
      <Outlet />
      {children}
    </PageStyled>
    ) : null
  );
};
