import styled from 'styled-components';

const Container = styled.div<{ bottom: string }>`
  position: fixed;
  bottom: ${({ bottom }) => bottom};
  left: 0;
  width: 100%;
  z-index: 20;
  padding: 20px 16px 20px 16px;
`;

interface Props {
  children: React.ReactNode;
  bottom?: string;
}

export const BottomFloat: React.FC<Props> = ({ children, bottom = '0px' }) => (
  <Container bottom={bottom}>{children}</Container>
);
