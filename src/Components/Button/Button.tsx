import { Sprite } from '../Sprite';
import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from 'theme';

interface Variation {
  active: string;
  border: string;
  default: string;
  hover: string;
  hoverBorder: string;
  color: string;
  disabled: string;
  focus: string;
}

const variations: {
  default: Variation;
  primary: Variation;
  secondary: Variation;
  transparent: Variation;
} = {
  default: {
    active: COLORS.NEUTRAL_500,
    border: COLORS.NEUTRAL_700,
    default: COLORS.NEUTRAL_700,
    hover: COLORS.NEUTRAL_800,
    hoverBorder: COLORS.NEUTRAL_800,
    color: COLORS.WHITE,
    disabled: COLORS.NEUTRAL_400,
    focus: COLORS.NEUTRAL_800,
  },
  primary: {
    active: COLORS.PRIMARY_300,
    border: COLORS.PRIMARY_550,
    default: COLORS.PRIMARY_550,
    hover: COLORS.PRIMARY_600,
    hoverBorder: COLORS.PRIMARY_600,
    color: COLORS.WHITE,
    disabled: COLORS.NEUTRAL_400,
    focus: COLORS.PRIMARY_500,
  },
  secondary: {
    active: 'transparent',
    border: COLORS.PRIMARY_500,
    default: 'transparent',
    hover: 'transparent',
    hoverBorder: COLORS.PRIMARY_550,
    color: COLORS.WHITE,
    disabled: COLORS.NEUTRAL_400,
    focus: COLORS.WHITE,
  },
  transparent: {
    active: 'transparent',
    border: 'transparent',
    default: 'transparent',
    hover: 'transparent',
    hoverBorder: 'transparent',
    color: COLORS.WHITE,
    disabled: 'transparent',
    focus: COLORS.WHITE,
  },
};

type StyledButtonProps = {
  variant: 'default' | 'primary' | 'secondary' | 'transparent';
  layout: 'column' | 'row';
  icon?: string;
  iconGap?: string;
  iconLocation?: 'top' | 'right' | 'bottom' | 'left';
  size: 'large' | 'medium';
};

const ButtonWrapper = styled.div``;

const IconStyling = css<StyledButtonProps>`
  ${({ icon, iconGap, iconLocation }) =>
    !!icon &&
    `
    display: flex;
    align-items: center;
    ${
      iconLocation === 'top'
        ? `flex-direction: column; svg { margin-bottom: ${iconGap}; }`
        : ''
    }
    ${
      iconLocation === 'bottom'
        ? `flex-direction: column; svg { margin-top: ${iconGap}; }`
        : ''
    }
    ${iconLocation === 'left' ? `svg { margin-right: ${iconGap}; }` : ''}
    ${iconLocation === 'right' ? `svg { margin-left: ${iconGap}; }` : ''}
  `}
`;

const getSizeProps = (size: 'large' | 'medium') => {
  switch (size) {
    case 'large':
      return `
      padding: 12px 20px;
      font-size: 1.4rem;
    `;
    case 'medium':
      return `
      padding: 6px 12px;
      font-size: 1.2rem;
    `;
    default:
      return '';
  }
};

const StyledButton = styled.button<StyledButtonProps>`
  width: 100%;
  border: none;
  border-radius: 4px;
  color: ${({ variant }) => variations[variant].color};
  font-weight: 500;
  border: 1px solid ${({ variant }) => variations[variant].border};
  background-color: ${({ variant }) => variations[variant].default};
  cursor: pointer;
  pointer-events: auto;
  font-family: 'Gothic A1', sans-serif;
  justify-content: center;
  &:hover,
  &:focus {
    border-color: ${({ variant }) => variations[variant].focus};
    background-color: ${({ variant }) => variations[variant].hover};
    outline: 1px solid ${({ variant }) => variations[variant].hover};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${({ variant }) => variations[variant].active};
  }

  &:disabled {
    background-color: ${({ variant }) => variations[variant].disabled};
    border-color: ${({ variant }) => variations[variant].disabled};
    cursor: not-allowed;
  }
  ${({ size }) => getSizeProps(size)}
  ${IconStyling}
`;

const ButtonContent = styled.span`
  line-height: 100%;
`;

type SvgProps = {
  alt?: string;
  animate?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  secondaryColor?: string;
  size?: string;
  spin?: string | number;
};

type Props = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  variant?: 'default' | 'primary' | 'secondary' | 'transparent';
  layout?: 'column' | 'row';
  disabled?: boolean;
  title?: string;
  icon?: string;
  iconLocation?: 'top' | 'right' | 'bottom' | 'left';
  iconGap?: string;
  iconSize?: string;
  iconProps?: SvgProps;
  size?: 'large' | 'medium';
};

export const Button = ({
  title,
  children,
  variant = 'primary',
  layout = 'column',
  onClick,
  disabled = false,
  iconLocation = 'left',
  icon,
  iconSize = '14px',
  iconGap = '14px',
  iconProps,
  size = 'large',
  ...rest
}: Props) => (
  <ButtonWrapper title={title}>
    <StyledButton
      variant={variant}
      layout={layout}
      onClick={onClick}
      {...rest}
      disabled={disabled}
      icon={icon}
      iconGap={iconGap}
      iconLocation={iconLocation}
      size={size}
    >
      {!!icon && (iconLocation === 'top' || iconLocation === 'left') && (
        <Sprite icon={icon} size={iconSize} {...iconProps} />
      )}
      {!!children && <ButtonContent>{children}</ButtonContent>}
      {!!icon && (iconLocation === 'bottom' || iconLocation === 'right') && (
        <Sprite icon={icon} size={iconSize} {...iconProps} />
      )}
    </StyledButton>
  </ButtonWrapper>
);
