import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

type SvgProps = {
  alt?: string;
  animate?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  secondaryColor?: string;
  size?: string;
  spin?: string | number;
};

const Svg = styled.svg<SvgProps>`
  --secondaryColor: ${({ secondaryColor }) => secondaryColor};
  width: ${({ size = '100%', width }) => width || size};
  height: ${({ size = '100%', height }) => height || size};
  transform: ${({
    flipX = false,
    flipY = false,
    spin = 0
  }) => `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''} ${Boolean(spin) ? `rotate(${spin}deg)` : ''}`};
  transition: ${({ animate = false }) => animate && 'transform 300ms linear'};
  z-index: 1;
`;

type SpriteProps = {
  color?: string;
  height?: string;
  icon: string;
  width?: string;
  onClick?: () => void;
  viewBox?: string;
} & SvgProps;

export const Sprite = ({
  alt,
  animate = false,
  color = COLORS.PRIMARY_500,
  icon,
  secondaryColor = COLORS.WHITE,
  onClick,
  viewBox,
  ...svgIcons
}: SpriteProps) => {

  return (
    <Svg
      {...svgIcons}
      alt={alt || `${icon} icon`}
      animate={animate}
      color={color}
      secondaryColor={secondaryColor}
      onClick={onClick}
      {...(viewBox ? { viewBox } : {})}
    >
      <use href={`#${icon}`} />
    </Svg>
  );
};

Sprite.propTypes = {
  alt: PropTypes.string,
  animate: PropTypes.bool,
  color: PropTypes.string,
  flipX: PropTypes.bool,
  flipY: PropTypes.bool,
  height: PropTypes.string,
  icon: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string,
  size: PropTypes.string,
  spin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
};

Sprite.defaultProps = {
  alt: null,
  animate: false,
  color: '',
  flipX: false,
  flipY: false,
  height: null,
  secondaryColor: 'WHITE',
  size: '100%',
  spin: 0,
  width: null,
};

// Exposes Icon constant so it doesn't need to be imported separately when consuming component
Sprite.Icon = ICON_NAMES;
