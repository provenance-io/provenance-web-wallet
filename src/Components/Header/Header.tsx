import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Sprite, Typo } from 'Components';
import { COLORS } from 'theme';
import { ICON_NAMES } from 'consts';
import React from 'react';

const Wrapper = styled.header<{ marginBottom: string }>`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: ${({ marginBottom }) => marginBottom};
  width: 100%;
`;

const Content = styled.div<{ excludeBackButton: boolean }>`
  display: grid;
  grid-template-columns: ${({ excludeBackButton }) =>
    excludeBackButton ? '1fe' : '1.4rem 1fr 1.4rem'};
  align-items: center;
  text-transform: capitalize;
`;

const ProgressBar = styled.div<{ progress?: number }>`
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
    ${({ progress }) => progress && `width: ${progress}%;`}
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
  &:focus {
    outline: none;
    color: ${COLORS.PRIMARY_400};
    svg {
      stroke-width: 4px;
    }
  }
`;

interface BackButtonProps {
  children: React.ReactNode;
  backLocation?: string;
  backCallback?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  children,
  backLocation,
  backCallback,
}) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    if (backCallback) backCallback();
    backLocation ? navigate(backLocation) : navigate(-1);
  };

  return <LinkOrButton onClick={handleBackClick}>{children}</LinkOrButton>;
};

interface HeaderProps {
  iconLeft?: string;
  progress?: number;
  title?: string | React.ReactNode;
  marginBottom?: string;
  backLocation?: string;
  backCallback?: () => void;
}

export const Header = ({
  iconLeft = ICON_NAMES.ARROW,
  progress,
  title,
  marginBottom = '32px',
  backLocation,
  backCallback,
}: HeaderProps) => {
  const excludeBackButton =
    iconLeft === 'false' || iconLeft === 'none' || iconLeft === 'off';

  return (
    <Wrapper marginBottom={marginBottom}>
      <Content excludeBackButton={excludeBackButton}>
        {!excludeBackButton && (
          <BackButton backLocation={backLocation} backCallback={backCallback}>
            <Sprite size="1.4rem" icon={iconLeft} />
          </BackButton>
        )}
        {title && <Typo type="subhead">{title}</Typo>}
      </Content>
      {progress !== undefined && <ProgressBar progress={progress} />}
    </Wrapper>
  );
};
