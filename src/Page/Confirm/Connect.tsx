import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'Components';
import { COLORS } from 'theme';
import background from 'theme/bg.png';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;
const TitleContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Title = styled.div`
  font-weight: 700;
  margin-bottom: 25px;
  font-size: 2rem;
  text-align: center;
`;
const SubTitle = styled(Title)`
  font-weight: 400;
  font-size: 1.5rem;
`;
const BlockImageContainer = styled.div`
  display: flex;
  align-self: center;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
  margin-left: 80px;
  border-radius: 100%;
  background: ${COLORS.NEUTRAL_700};
  height: 150px;
  width: 150px;
  overflow: hidden;
`;
const BlockImageLetter = styled.span`
  font-size: 7rem;
  color: ${COLORS.PRIMARY_100};
  text-transform: uppercase;
`;
const ImageElement = styled.img`
  width: 100%;
`;
const ButtonGroup = styled.div`
  margin-top: auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-self: center;
`;
const CancelButton = styled(Button)`
  color: ${COLORS.PRIMARY_550};
  background: none;
  border: none;
  margin-top: 30px;
  margin-bottom: 20px;
`;

interface ConnectProps {
  requestor: string;
  url?: string;
  onClick: () => void;
}

export const Connect = ({
  requestor,
  url = "",
  onClick,
}: ConnectProps) => {
  const navigate = useNavigate();

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
      <TitleContainer>
        <Title>CONNECTION<br/>REQUEST</Title>
        <SubTitle>
          Allow connection to {requestor}
        </SubTitle>
        <BlockImageContainer
          title={requestor}
        >
          {url ? (
            <ImageElement
              src={url}
              alt={requestor}
              title={requestor}
            />
          ) : (
            <BlockImageLetter>
              {requestor[0]}
            </BlockImageLetter>
          )}
        </BlockImageContainer>
      </TitleContainer>
      <ButtonGroup>
        <Button variant={'primary'} onClick={handleApprove}>Approve</Button>
        <CancelButton variant={'default'} onClick={handleDecline}>
          Reject
        </CancelButton>
      </ButtonGroup>
    </Container>
  );
};