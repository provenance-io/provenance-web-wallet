import React from 'react';
import { StyledButton as BaseStyledButton } from '../Styled';
import styled from 'styled-components';
import { COLORS } from 'theme';

interface Variation {
  active: string;
  border: string;
  default: string;
  hover: string;
  color: string;
}

const variations: { default: Variation; primary: Variation; secondary: Variation, transparent: Variation } =
  {
    default: {
      active: COLORS.NEUTRAL_500,
      border: COLORS.NEUTRAL_700,
      default: COLORS.NEUTRAL_700,
      hover: COLORS.NEUTRAL_800,
      color: COLORS.WHITE,
    },
    primary: {
      active: COLORS.PRIMARY_300,
      border: COLORS.PRIMARY_550,
      default: COLORS.PRIMARY_550,
      hover: COLORS.PRIMARY_650,
      color: COLORS.WHITE,
    },
    secondary: {
      active: COLORS.SECONDARY_700,
      border: COLORS.SECONDARY_400,
      default: COLORS.SECONDARY_700,
      hover: COLORS.SECONDARY_700,
      color: COLORS.WHITE,
    },
    transparent: {
      active: 'transparent',
      border: 'transparent',
      default: 'transparent',
      hover: 'transparent',
      color: COLORS.WHITE,
    },
  };

type StyledButtonProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'transparent';
};

const StyledButton = styled(BaseStyledButton)<StyledButtonProps>`
  padding: 14px 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  color: ${({ variant = 'default' }) => variations[variant].color};
  font-weight: 500;
  font-size: 1.4rem;
  border: 2px solid ${({ variant = 'default' }) => variations[variant].border};
  background-color: ${({ variant = 'default' }) => variations[variant].default};
  cursor: pointer;
  font-family: 'Gothic A1', sans-serif;
  &:hover,
  &:focus {
    border-color: ${({ variant = 'default' }) =>
      variant === 'default'
        ? 'transparent'
        : variant === 'secondary'
        ? variations[variant].border
        : COLORS.WHITE};
    background-color: ${({ variant = 'default' }) => variations[variant].hover};
  }

  &:active {
    background-color: ${({ variant = 'default' }) => variations[variant].active};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
} & StyledButtonProps;

export const Button = ({ children, variant = 'default', ...rest }: ButtonProps) => (
  <StyledButton variant={variant} {...rest}>
    {children}
  </StyledButton>
);
