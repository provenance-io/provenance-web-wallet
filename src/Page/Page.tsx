import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { COLORS, FONTS } from 'theme';
import bg from 'images/bg.png';

interface Props {
  children?: React.ReactNode;
  bgImage?: boolean;
  align?: string;
  justify?: string;
}

const PageStyled = styled.div<Props>`
  align-items: ${({ align }) => align};
  background: ${({ bgImage }) =>
    bgImage ? `${COLORS.BACKGROUND_1} url(${bg}) no-repeat` : COLORS.BACKGROUND_1};
  background-size: cover;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: ${FONTS.SECONDARY_FONT};
  justify-content: ${({ justify }) => justify};
  text-align: ${({ align }) => (align === 'flex-start' ? 'left' : 'center')};
  z-index: 10;
  height: auto;
  width: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Page = ({
  children = null,
  bgImage,
  align = 'flex-start',
  justify = 'flex-start',
}: Props) => (
  <PageStyled bgImage={bgImage} align={align} justify={justify}>
    <Outlet />
    {children}
  </PageStyled>
);
