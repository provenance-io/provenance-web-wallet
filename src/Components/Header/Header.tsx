import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { combineCss, Sprite } from 'Components';
import { COLORS, FONTS } from 'theme';
import { ICON_NAMES } from 'consts';
import React from 'react';

const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
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
  progress: number;
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

const BackButton = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return <LinkOrButton onClick={() => navigate(-1)}>{children}</LinkOrButton>;
};

interface HeaderProps {
  iconLeft?: string;
  progress: number;
  title: string;
}

export const Header = ({ iconLeft = ICON_NAMES.ARROW, progress, title }: HeaderProps) => (
  <Wrapper>
    <Content>
      <BackButton>
        <Sprite size="1.4rem" icon={iconLeft} />
      </BackButton>
      <Title>{title}</Title>
    </Content>
    <ProgressBar progress={progress} />
  </Wrapper>
);
