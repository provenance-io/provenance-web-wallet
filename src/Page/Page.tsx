import React from 'react';
import { Outlet } from 'react-router-dom';
import { css } from 'styled-components';
import { Div } from 'Components';
import { COLORS } from 'theme';
import bg from './bg.png';

interface PageProps {
  children?: React.ReactNode;
  hasImage?: boolean;
}

export const Page = ({ children = null, hasImage = false }: PageProps) => (
  <Div
    $css={css`
      padding: 42px 16px;
      background: ${hasImage
        ? `url('${bg}') ${COLORS.BACKGROUND_1} no-repeat top / cover`
        : COLORS.BACKGROUND_1};
      min-height: 100vh;
      height: 100%;
    `}
  >
    <Outlet />
    {children}
  </Div>
);
