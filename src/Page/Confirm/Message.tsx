import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, List } from 'Components';
import { COLORS } from 'theme';

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
  cursor: pointer;
`;
const ButtonGroup = styled.div`
  margin-top: auto;
`;
const CancelButton = styled(Button)`
  color: ${COLORS.PRIMARY_550};
  background: none;
  border: none;
  margin-top: 10px;
`;

interface MsgProps {
  message: {
    [key: string]: string;
  };
  title?: string;
  onClick: () => void;
  showData?: boolean;
}

export const Message = ({
  message,
  title = 'Transaction',
  showData = true,
  onClick,
}: MsgProps) => {
  const navigate = useNavigate();

  const handleData = () => {
    // TODO: Do we want a modal with the JSON here?
  }

  const handleApprove = () => {
    // TODO: Add approve actions
    onClick();
  }

  const handleDecline = () => {
    // TODO: Add decline actions
    navigate('/dashboard');
  }

  return (
    <Container>
      <TitleBar>
        <Title>{title}</Title>
        {showData && <Data onClick={handleData}>Data</Data>}
      </TitleBar>
      <List message={message} />
      <ButtonGroup>
        <Button variant={'primary'} onClick={handleApprove}>Approve</Button>
        <CancelButton variant={'default'} onClick={handleDecline}>
          Decline
        </CancelButton>
      </ButtonGroup>
    </Container>
  );
};
