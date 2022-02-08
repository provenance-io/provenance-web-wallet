import { StyledButton as BaseStyledButton } from '../Styled';
import styled from 'styled-components';

const StyledButton = styled(BaseStyledButton)`
  padding: 14px 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.WHITE};
  font-weight: 500;
  font-size: 1.4rem;
  background-color: ${({ theme }) => theme.PRIMARY_550};
  cursor: pointer;
`;

export const Button = ({ children, ...rest }) => <StyledButton {...rest}>{children}</StyledButton>;
