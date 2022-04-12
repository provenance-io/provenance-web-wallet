import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'Components';
import { COLORS } from 'theme';
import { capitalize } from 'utils';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const TitleBar = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  margin-bottom: 30px;
`;
const Title = styled.div`
  font-weight: 700;
  flex: 0 1 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
const Data = styled.div`
  color: ${COLORS.PRIMARY_550};
  flex: 0 1 auto;
  margin-left: auto;
  padding-right: 20px;
`;
const Section = styled.div`
  border-bottom: 1px solid #3d4151;
  padding: 20px 20px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.div`
  font-weight: 100;
`;
const SectionContent = styled.div`
  font-weight: 100;
`;
const ButtonGroup = styled.div`
  margin-top: auto;
`;
const CancelButton = styled(Button)`
  color: ${COLORS.PRIMARY_550};
  background: none;
  border: none;
  margin-top: 30px;
`;

interface MsgProps {
  message: {
    [key: string]: string;
  };
  onClick: () => void;
}

export const Message = ({
  message,
  onClick,
}: MsgProps) => {
  const navigate = useNavigate();

  const handleData = () => {
    // TODO: Do we want a modal with the JSON here?
  }

  const createList = Object.keys(message).map(item => (
    <Section key={item}>
      <SectionTitle>{capitalize(item)}</SectionTitle>
      <SectionContent>{message[item]}</SectionContent>
    </Section>
  ));

  const handleApprove = () => {
    // TODO: Add approve actions
    onClick();
    navigate('/transactions');
  }

  const handleDecline = () => {
    // TODO: Add decline actions
    navigate('/dashboard');
  }

  return (
    <Container>
      <TitleBar>
        <Title>Transaction</Title>
        <Data onClick={handleData}>Data</Data>
      </TitleBar>
      {createList}
      <ButtonGroup>
        <Button variant={'primary'} onClick={handleApprove}>Approve</Button>
        <CancelButton variant={'default'} onClick={handleDecline}>
          Decline
        </CancelButton>
      </ButtonGroup>
    </Container>
  );
};
