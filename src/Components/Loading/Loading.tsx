import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Sprite as SpriteBase } from '../Sprite/Sprite';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const InlineLoading = styled.div`
  height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const FullscreenLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: ${COLORS.BLACK_20};
  height: 100%;
  width: 100%;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 50%;
  backdrop-filter: blur(2px);
  cursor: progress;
`;
const RotationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${rotateAnimation} 2s linear infinite;
`;

const Sprite = styled(SpriteBase)`
  color: ${COLORS.PRIMARY_500};
`;

interface Props {
  className?: string;
  size?: string;
  fullscreen?: boolean;
}

export const Loading: React.FC<Props> = ({ className, size, fullscreen }) =>
  fullscreen ? (
    <FullscreenLoading data-testid="loading">
      <RotationContainer>
        <Sprite icon={ICON_NAMES.IN_PROGRESS} size={size || '100px'} />
      </RotationContainer>
    </FullscreenLoading>
  ) : (
    <InlineLoading className={className} data-testid="loading">
      <RotationContainer>
        <Sprite icon={ICON_NAMES.IN_PROGRESS} size={size || '5rem'} />
      </RotationContainer>
    </InlineLoading>
  );
