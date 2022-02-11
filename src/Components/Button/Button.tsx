import React from 'react';
import { StyledButton as BaseStyledButton } from '../Styled';
import styled from 'styled-components';
import { COLORS } from 'theme';

const variations: { default: string; primary: string; secondary: string } = {
  default: COLORS.NEUTRAL_700,
  primary: COLORS.PRIMARY_500,
  secondary: COLORS.SECONDARY_500,
};

type StyledButtonProps = {
  variant?: 'default' | 'primary' | 'secondary';
};

const StyledButton = styled(BaseStyledButton)<StyledButtonProps>`
  padding: 14px 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  color: ${COLORS.WHITE};
  font-weight: 500;
  font-size: 1.4rem;
  background-color: ${({ variant = 'default' }) => variations[variant]};
  cursor: pointer;
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
