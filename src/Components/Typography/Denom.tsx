import styled from 'styled-components';

interface StyledProps {
  size: string,
  spacing?: string;
}

const StyledDenom = styled.span<StyledProps>`
  font-size: ${({ size }) => size };
  margin-right: ${({ spacing }) => spacing};
`;

interface Props {
  children: React.ReactNode;
  size?: string;
  spacing?: string;
}

export const Denom:React.FC<Props> = ({ children, size='2rem', spacing='4px' }) => {
  return (
    <StyledDenom size={size} spacing={spacing}>{children}</StyledDenom>
  )
};
