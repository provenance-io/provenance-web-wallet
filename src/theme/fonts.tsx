import { Helmet } from 'react-helmet-async';
import { css } from 'styled-components';

export const FONT_VARIABLES = {
  PRIMARY_FONT: '--font-primary',
  SECONDARY_FONT: '--font-secondary',
};

export const baseFonts = css`
  ${FONT_VARIABLES.PRIMARY_FONT}: Gothic A1, sans-serif;
  ${FONT_VARIABLES.SECONDARY_FONT}: Montserrat, sans-serif;
`;

export const FONTS = (Object.keys(FONT_VARIABLES) as Array<keyof typeof FONT_VARIABLES>).reduce(
  (acc: Partial<{ [key in keyof typeof FONT_VARIABLES]: string }>, key) => ({
    ...acc,
    [key]: `font-family: var(${FONT_VARIABLES[key]});`,
  }),
  {}
);

export const BaseTypographyLoader = () => (
  <Helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;500;700&family=Montserrat:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
  </Helmet>
);
