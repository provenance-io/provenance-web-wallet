import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { normalize } from 'styled-normalize';
import { BaseTypographyLoader, FONTS } from './fonts';
import { COLORS } from './colors';
import { ThemeProvider } from 'styled-components';
import { SpriteSheet } from 'Components';

export const baseTheme: DefaultTheme = {
  colors: { ...COLORS },
  fonts: { ...FONTS },
};

export const GlobalStyles = createGlobalStyle`
  ${normalize}

  // React local causes iframe when error process is not defined shows up.
  // https://github.com/facebook/create-react-app/issues/11773
  iframe {
    pointer-events: none;
  }

  html {
    font-size: 62.5%; // 1rem = 10px
    box-sizing: border-box;
    background: black;
    height: 100%;
    width: 100%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    color: ${COLORS.WHITE};
    font-family: ${FONTS.PRIMARY_FONT};
    font-weight: 400;
    font-size: 1.6rem;
    height: 100%;
    width: 100%;
  }

  pre {
    white-space: break-spaces;
    line-height: 1.8rem;
    font-size: 1.2rem;
    word-break: break-word;
  }

  button, div, a, p {
    letter-spacing: 0.04rem;
  }

  a {
    color: ${COLORS.PRIMARY_400};
    text-decoration: none;
    &:hover{
      color: ${COLORS.PRIMARY_450};
    }
  }

  #root {
    height: 100%;
  }
`;

export type ThemeProps = {
  children: ReactNode;
  $colors?: string;
  $fonts?: string;
  theme?: object;
};

export const Theme = ({
  children,
  $colors = '',
  $fonts = '',
  theme = {},
}: ThemeProps) => (
  <ThemeProvider theme={{ ...baseTheme, ...theme }}>
    <HelmetProvider>
      <SpriteSheet />
      <BaseTypographyLoader />
      <GlobalStyles />
      {children}
    </HelmetProvider>
  </ThemeProvider>
);
