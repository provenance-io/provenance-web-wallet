import styled from 'styled-components';

const Container = styled.div<{ bottom: string; padding: string }>`
  position: fixed;
  bottom: ${({ bottom }) => bottom};
  left: 0;
  width: 100%;
  z-index: 20;
  padding: ${({ padding }) => padding};
`;

interface Props {
  children: React.ReactNode;
  bottom?: string;
  padding?: string;
}

export const BottomFloat: React.FC<Props> = ({
  children,
  bottom = '0px',
  padding = '16px',
}) => (
  <Container bottom={bottom} padding={padding}>
    {children}
  </Container>
);
