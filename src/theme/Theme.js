import { HelmetProvider } from 'react-helmet-async';
import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import { baseFonts, BaseTypographyLoader, FONTS } from './fonts';
import { baseColors, COLORS } from './colors';
import { ThemeProvider } from 'styled-components';
import bg from './bg.png';

export const baseTheme = {
  ...COLORS,
  ...FONTS,
};

export const GlobalStyles = createGlobalStyle`
  ${normalize}

  :root {
    ${baseColors};
    ${baseFonts};
    ${({ colors }) => colors};
    ${({ fonts }) => fonts};
  }

  html {
    font-size: 62.5%; // 1rem = 10px
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    background: url('${bg}') ${COLORS.BACKGROUND_1} no-repeat top / cover;
    color: ${COLORS.WHITE};
    ${FONTS.PRIMARY_FONT};
    font-weight: 400;
    font-size: 1.6rem;
  }
`;

export const Theme = ({ children, $colors = '', $fonts = '', theme = {} }) => (
  <ThemeProvider theme={{ ...baseTheme, ...theme }}>
    <HelmetProvider>
      <BaseTypographyLoader />
      <GlobalStyles colors={$colors} fonts={$fonts} />
      {children}
    </HelmetProvider>
  </ThemeProvider>
);
