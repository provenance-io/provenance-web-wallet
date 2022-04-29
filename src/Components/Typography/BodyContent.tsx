import styled from 'styled-components';
import { combineCss } from 'Components';
import { FONTS } from 'theme/fonts';

export const BodyContent = styled.p`
  margin: 0 0 32px 0;
  ${FONTS.PRIMARY_FONT};
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.04rem;
  line-height: 2.2rem;
  text-align: center;

  ${combineCss()}
`;
