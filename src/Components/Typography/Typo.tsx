import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS, FONTS } from 'theme';

/*
  ${FONT_VARIABLES.PRIMARY_FONT}: Gothic A1, sans-serif;
  ${FONT_VARIABLES.SECONDARY_FONT}: Montserrat, sans-serif; 
*/

interface StyledProps {
  align: 'left' | 'right' | 'center';
  marginTop?: string;
  marginBottom?: string;
  textStyle: 'italic' | 'normal';
  color: keyof typeof COLORS;
  bold?: boolean;
  italic?: boolean;
}

const StylingMixin = css<StyledProps>`
  margin: 0;
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};`}
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};`}
  text-align: ${({ align }) => align};
  font-style: ${({ textStyle }) => textStyle};
  color: ${({ color }) => COLORS[color]};
  ${({ bold }) => bold && `font-weight: 700;`}
  ${({ italic }) => italic && `font-style: italic;`}
`;

const TitleStyle = styled.p`
  ${FONTS.PRIMARY_FONT};
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 2.88rem;
  letter-spacing: 0.04em;
  ${StylingMixin}
`;

const DisplayBodyStyle = styled.p`
  ${FONTS.SECONDARY_FONT};
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 2.48rem;
  letter-spacing: 0.04em;
  ${StylingMixin}
`;

const Display1Style = styled.p`
  ${FONTS.SECONDARY_FONT};
  font-weight: 300;
  font-size: 4.4rem;
  line-height: 5.36rem;
  letter-spacing: 0.02em;
  ${StylingMixin}
`;

const Display2Style = styled.p`
  ${FONTS.SECONDARY_FONT};
  font-weight: 300;
  font-size: 3.8rem;
  line-height: 4.6rem;
  letter-spacing: 0.02em;
  ${StylingMixin}
`;

const BodyStyle = styled.p`
  ${FONTS.PRIMARY_FONT};
  font-weight: 400;
  line-height: 2.24rem;
  letter-spacing: 0.04em;
  font-size: 1.4rem;
  ${StylingMixin}
`;
const ErrorStyle = styled(BodyStyle)`
  color: #ed6e74;
`;
const SubheadStyle = styled.p`
  ${FONTS.PRIMARY_FONT};
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 2.22rem;
  letter-spacing: 0.04em;
  ${StylingMixin}
`;
const Headline2Style = styled.p`
  ${FONTS.SECONDARY_FONT};
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 1.95rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  ${StylingMixin}
`;
const FootnoteStyle = styled.p`
  ${FONTS.PRIMARY_FONT};
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.92rem;
  letter-spacing: 0.4em;
  ${StylingMixin}
`;

type TypoType =
  | 'body'
  | 'subhead'
  | 'headline2'
  | 'error'
  | 'displayBody'
  | 'title'
  | 'display1'
  | 'display2'
  | 'footnote';
interface Props {
  className?: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  type: TypoType;
  marginTop?: string;
  marginBottom?: string;
  textStyle?: 'italic' | 'normal';
  color?: keyof typeof COLORS;
  bold?: boolean;
  italic?: boolean;
}

export const Typo: React.FC<Props> = ({
  className,
  children,
  align = 'center',
  type,
  marginTop,
  marginBottom,
  textStyle = 'normal',
  color = 'WHITE',
  bold,
  italic,
}) => {
  const allProps = {
    className,
    align,
    type,
    marginTop,
    marginBottom,
    textStyle,
    color,
    bold,
    italic,
  };
  const getStyledType = () => {
    switch (type) {
      case 'body':
        return <BodyStyle {...allProps}>{children}</BodyStyle>;
      case 'subhead':
        return <SubheadStyle {...allProps}>{children}</SubheadStyle>;
      case 'headline2':
        return <Headline2Style {...allProps}>{children}</Headline2Style>;
      case 'error':
        return <ErrorStyle {...allProps}>{children}</ErrorStyle>;
      case 'displayBody':
        return <DisplayBodyStyle {...allProps}>{children}</DisplayBodyStyle>;
      case 'display1':
        return <Display1Style {...allProps}>{children}</Display1Style>;
      case 'display2':
        return <Display2Style {...allProps}>{children}</Display2Style>;
      case 'title':
        return <TitleStyle {...allProps}>{children}</TitleStyle>;
      case 'footnote':
        return <FootnoteStyle {...allProps}>{children}</FootnoteStyle>;
    }
  };

  return getStyledType();
};
