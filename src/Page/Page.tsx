import React from 'react';
import { Outlet } from 'react-router-dom';
import { css } from 'styled-components';
import { Div } from 'Components';
import { COLORS } from 'theme';

interface PageProps {
  children?: React.ReactNode;
}

export const Page = ({ children = null }: PageProps) => (
  <Div
    $css={css`
      background: ${COLORS.BACKGROUND_1};
      min-height: 100%;
    `}
  >
    <Outlet />
    {children}
  </Div>
);
