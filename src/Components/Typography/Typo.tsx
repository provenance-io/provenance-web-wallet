import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from 'theme';

interface StyledProps {
  align: 'left' | 'right' | 'center';
  marginTop?: string,
  marginBottom?: string,
  textStyle: 'italic' | 'normal',
  color: keyof typeof COLORS,
}

const StylingMixin = css<StyledProps>`
  margin: 0;
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};` }
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};` }
  text-align: ${({ align }) => align };
  font-style: ${({ textStyle }) => textStyle };
  color: ${({ color }) => COLORS[color] };
`;

const DisplayBodyStyle = styled.p`
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 2.48rem;
  letter-spacing: 0.04em;
  ${StylingMixin}
`;

const BodyStyle = styled.p`
  font-family: 'Gothic A1', sans-serif;
  font-weight: 400;
  line-height: 2.24rem;
  letter-spacing: 0.04em;
  font-size: 1.4rem;
  ${StylingMixin}
`;
const ErrorStyle = styled(BodyStyle)`
  color: #ED6E74;
`;
const SubheadStyle = styled.p`
  font-family: 'Gothic A1', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 2.22rem;
  letter-spacing: 0.04em;
  ${StylingMixin}
`;
const Headline2Style = styled.p`
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 1.95rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  ${StylingMixin}
`;

type TypoType = 'body' | 'subhead' | 'headline2' | 'error' | 'displayBody';
interface Props {
  className?: string,
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  type: TypoType;
  marginTop?: string,
  marginBottom?: string,
  textStyle?: 'italic' | 'normal',
  color?: keyof typeof COLORS,
}

export const Typo:React.FC<Props> = ({
  className,
  children,
  align = 'center',
  type,
  marginTop,
  marginBottom,
  textStyle = 'normal',
  color = 'WHITE',
}) => {
  const allProps = { className, align, type, marginTop, marginBottom, textStyle, color };
  const getStyledType = () => {
    switch (type) {
      case 'body': return <BodyStyle {...allProps}>{children}</BodyStyle>
      case 'subhead': return <SubheadStyle {...allProps}>{children}</SubheadStyle>
      case 'headline2': return <Headline2Style {...allProps}>{children}</Headline2Style>
      case 'error': return <ErrorStyle {...allProps}>{children}</ErrorStyle>
      case 'displayBody': return <DisplayBodyStyle {...allProps}>{children}</DisplayBodyStyle>
    }
  }
  
  return getStyledType();
}
