import React from 'react';
import styled from 'styled-components';

interface StyledProps {
  align: 'left' | 'right' | 'center';
}

const BodyStyle = styled.p<StyledProps>`
  font-family: 'Gothic A1', sans-serif;
  font-weight: 400;
  line-height: 2.24rem;
  letter-spacing: 0.04em;
  font-size: 1.4rem;
  text-align: ${({ align }) => align };
  color: #FFFFFF;
`;
const ErrorStyle = styled(BodyStyle)`
  color: #ED6E74;
`;
const SubheadStyle = styled.p<StyledProps>`
  font-family: 'Gothic A1', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 2.22rem;
  letter-spacing: 0.04em;
  text-align: ${({ align }) => align };
  color: #FFFFFF;
`;
const Headline2Style = styled.p<StyledProps>`
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 1.95rem;
  letter-spacing: 0.32em;
  text-align: ${({ align }) => align };
  color: #FFFFFF;
  text-transform: uppercase;
`;

type TypoType = 'body' | 'subhead' | 'headline2' | 'error';
interface Props {
  className?: string,
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  type: TypoType;
}

export const Typo:React.FC<Props> = ({
  className,
  children,
  align = 'center',
  type,
}) => {
  const allProps = { className, align, type };
  const getStyledType = () => {
    switch (type) {
      case 'body': return <BodyStyle {...allProps}>{children}</BodyStyle>
      case 'subhead': return <SubheadStyle {...allProps}>{children}</SubheadStyle>
      case 'headline2': return <Headline2Style {...allProps}>{children}</Headline2Style>
      case 'error': return <ErrorStyle {...allProps}>{children}</ErrorStyle>
    }
  }
  
  return getStyledType();
}
