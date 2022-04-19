import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { combineCss, Sprite } from 'Components';
import { COLORS, FONTS } from 'theme';
import { ICON_NAMES } from 'consts';
import React from 'react';

const Wrapper = styled.header<{marginBottom: string}>`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: ${({ marginBottom }) => marginBottom };
  width: 100%;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1.4rem 1fr 1.4rem;
  align-items: center;
`;

const Title = styled.span`
  color: ${COLORS.WHITE};
  ${FONTS.PRIMARY_FONT};
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
  line-height: 2.24rem;
  text-align: center;
`;

const ProgressBar = styled.div<{
  progress?: number;
}>`
  position: relative;
  height: 3px;
  width: 100%;
  border-radius: 8px;
  background-color: ${COLORS.NEUTRAL_550};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    height: 100%;
    width: ${({ progress }) => progress}%;
    border-radius: 8px;
    background-color: ${COLORS.SECONDARY_400};
  }
`;

const LinkOrButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  border: none;
  color: inherit;
  background: none;
  cursor: pointer;

  ${combineCss()}
`;

const BackButton = ({ children, backLocation }: { children: React.ReactNode, backLocation?: string }) => {
  const navigate = useNavigate();
  return <LinkOrButton onClick={() => backLocation ? navigate(backLocation) : navigate(-1)}>{children}</LinkOrButton>;
};

interface HeaderProps {
  iconLeft?: string;
  progress?: number;
  title?: string | React.ReactNode;
  marginBottom?: string;
  backLocation?: string;
}

export const Header = ({ iconLeft = ICON_NAMES.ARROW, progress, title, marginBottom = '32px', backLocation }: HeaderProps) => (
  <Wrapper marginBottom={marginBottom}>
    <Content>
      <BackButton backLocation={backLocation}>
        <Sprite size="1.4rem" icon={iconLeft} />
      </BackButton>
      {title && <Title>{title}</Title>}
    </Content>
    {progress !== undefined && <ProgressBar progress={progress} />}
  </Wrapper>
);
