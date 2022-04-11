import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const SearchLoading = styled.div`
  height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  svg {
    animation: ${rotateAnimation} 2s linear infinite;
    color: #27497D;
  }
`;

interface Props {
  className?: string,
  size?: string,
}

export const Loading:React.FC<Props> = ({ className, size = '5rem' }) => (
  <SearchLoading className={className}>
    <Sprite icon={ICON_NAMES.IN_PROGRESS} size={size} />
  </SearchLoading>
);
