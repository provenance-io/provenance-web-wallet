import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';

interface Variation {
  active: string;
  border: string;
  default: string;
  hover: string;
  hoverBorder: string;
  color: string;
  disabled: string;
}

const variations: {
  default: Variation;
  primary: Variation;
  secondary: Variation;
  transparent: Variation;
} =
  {
    default: {
      active: COLORS.NEUTRAL_500,
      border: COLORS.NEUTRAL_700,
      default: COLORS.NEUTRAL_700,
      hover: COLORS.NEUTRAL_800,
      hoverBorder: COLORS.NEUTRAL_800,
      color: COLORS.WHITE,
      disabled: COLORS.NEUTRAL_400,
    },
    primary: {
      active: COLORS.PRIMARY_300,
      border: COLORS.PRIMARY_550,
      default: COLORS.PRIMARY_550,
      hover: COLORS.PRIMARY_650,
      hoverBorder: COLORS.PRIMARY_650,
      color: COLORS.WHITE,
      disabled: COLORS.NEUTRAL_400,
    },
    secondary: {
      active: COLORS.SECONDARY_700,
      border: COLORS.SECONDARY_400,
      default: COLORS.SECONDARY_700,
      hover: COLORS.SECONDARY_700,
      hoverBorder: COLORS.SECONDARY_700,
      color: COLORS.WHITE,
      disabled: COLORS.NEUTRAL_400,
    },
    transparent: {
      active: 'transparent',
      border: 'transparent',
      default: 'transparent',
      hover: 'transparent',
      hoverBorder: 'transparent',
      color: COLORS.WHITE,
      disabled: 'transparent',
    },
  };

type StyledButtonProps = {
  variant: 'default' | 'primary' | 'secondary' | 'transparent';
  layout: 'default' | 'float';
};

const ButtonWrapper = styled.div<StyledButtonProps>`
  ${({ layout }) => layout === 'float' && `
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 32px 16px;
    background: linear-gradient(0deg,rgba(26,28,35,1) 70%, rgba(26,28,35,0) 100%);
    width: 100%;
    max-width: 100%;
    z-index: 20;
    pointer-events:none;
  ` }
`;

const StyledButton = styled.button<StyledButtonProps>`
  padding: 14px 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  color: ${({ variant }) => variations[variant].color};
  font-weight: 500;
  font-size: 1.4rem;
  border: 2px solid ${({ variant }) => variations[variant].border};
  background-color: ${({ variant }) => variations[variant].default};
  cursor: pointer;
  pointer-events:auto;
  font-family: 'Gothic A1', sans-serif;
  &:hover,
  &:focus {
    border-color: ${({ variant }) => variations[variant].hoverBorder};
    background-color: ${({ variant }) => variations[variant].hover};
  }

  &:active {
    background-color: ${({ variant }) => variations[variant].active};
  }

  &:disabled {
    background-color: ${({ variant }) => variations[variant].disabled};
    border-color: ${({ variant }) => variations[variant].disabled};
    cursor: not-allowed;
  }
`;

export type Props = {
  children: React.ReactNode;
  onClick?: (event:React.MouseEvent) => void;
  variant?: 'default' | 'primary' | 'secondary' | 'transparent';
  layout?: 'default' | 'float';
  disabled?: boolean,
  title?: string,
};

export const Button = ({ title, children, variant = 'primary', layout = 'float', onClick, disabled = false, ...rest }: Props) => (
  <ButtonWrapper variant={variant} layout={layout} title={title}>
    <StyledButton variant={variant} layout={layout} onClick={onClick} {...rest} disabled={disabled} >
      {children}
    </StyledButton>
  </ButtonWrapper>
);
