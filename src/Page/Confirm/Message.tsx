import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ButtonGroup, List, Header } from 'Components';
import { COLORS } from 'theme';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';

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
const AddItems = styled.div`
  margin-top: 40px;
`;

interface MsgProps {
  message: {
    [key: string]: string;
  };
  title?: string;
  onClick: () => void;
  showData?: boolean;
  headerTitle?: string;
  buttonTitle?: string;
  cancelButton?: boolean;
  addItems?: JSX.Element[];
}

export const Message = ({
  message,
  title = 'Transaction',
  showData = true,
  headerTitle = '',
  buttonTitle = 'Approve',
  cancelButton = true,
  onClick,
  addItems,
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
    navigate(DASHBOARD_URL);
  }

  return (
    <Container>
      {headerTitle ? (
      <Header title={headerTitle} iconLeft={ICON_NAMES.CLOSE} />
      ) : (
      <TitleBar>
        <Title>{title}</Title>
        {showData && <Data onClick={handleData}>Data</Data>}
      </TitleBar>
      )}
      <List message={message} />
      <AddItems>{addItems}</AddItems>
      <ButtonGroup>
        <Button layout="default" onClick={handleApprove}>{buttonTitle}</Button>
        {cancelButton && 
          <Button layout="default" variant="transparent" onClick={handleDecline}>
            Decline
          </Button>
        }
      </ButtonGroup>
    </Container>
  );
};
