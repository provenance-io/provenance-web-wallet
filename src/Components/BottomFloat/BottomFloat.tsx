import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  padding: 20px 16px 20px 16px;
`;

interface Props {
  children: React.ReactNode;
}

export const BottomFloat:React.FC<Props> = ({ children }) => <Container>{children}</Container>;
