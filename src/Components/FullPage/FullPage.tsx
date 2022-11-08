import styled from 'styled-components';
import { COLORS } from 'theme';
import { TabHeader } from '../TabHeader/TabHeader';

const FullPageStyled = styled.div<{ padBottom?: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  max-width: 768px;
  padding: 50px 60px;
`;
const Content = styled.div`
  padding: 50px 60px;
  width: 100%;
  height: auto;
  background: ${COLORS.NEUTRAL_700};
  border-radius: 20px;
  margin-top: 20px;
`;

interface Props {
  children: React.ReactNode;
  padBottom?: string;
  title?: string;
}

export const FullPage: React.FC<Props> = ({ children, padBottom, title }) => {
  return (
    <FullPageStyled padBottom={padBottom}>
      <Container>
        <TabHeader title={title} />
        <Content>{children}</Content>
      </Container>
    </FullPageStyled>
  );
};
