import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button as BaseButton, Sprite } from 'Components';
import { COLORS } from 'theme';
import background from 'theme/bg.png';
import { ICON_NAMES } from 'consts';

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
  top: 40%;
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
const ImageContainer = styled.div`
  position: fixed;
  top: 200%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const BlockImageContainer = styled.div<{ color?: string }>`
  display: flex;
  align-self: center;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: ${COLORS.NEUTRAL_700};
  height: 150px;
  width: 150px;
  overflow: hidden;
  border: ${({ color }) => color && `1px solid ${color}`};
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
const Button = styled(BaseButton)`
  margin-bottom: 30px;
`;
const CancelButton = styled(BaseButton)`
  color: ${COLORS.PRIMARY_550};
  background: none;
  border: none;
  margin-bottom: 20px;
`;

interface ConnectProps {
  requestor?: string;
  url?: string;
  onClick: () => void;
  title?: string;
  info?: string;
  cancelButton?: boolean;
  buttonTitle?: string;
  icon?: string;
  color?: string;
}

export const Connect = ({
  requestor,
  title = 'connection request',
  info = '',
  url = "",
  onClick,
  cancelButton = true,
  buttonTitle = 'Approve',
  color = '',
  icon = '',
}: ConnectProps) => {
  const navigate = useNavigate();

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
      <TitleContainer>
        <Title>{title.toUpperCase()}</Title>
        <SubTitle>
          {requestor ? `Allow connection to ${requestor}` : info}
        </SubTitle>
        <ImageContainer>
          <BlockImageContainer color={color}
            title={requestor || icon}
          >
            {url ? (
              <ImageElement
                src={url}
                alt={requestor}
                title={requestor}
              />
            ) : (
              requestor ? (
              <BlockImageLetter>
                {requestor[0]}
              </BlockImageLetter>
              ) : (
                <Sprite icon={ICON_NAMES.CHECK} color={color} />
              )
            )}
          </BlockImageContainer>
        </ImageContainer>
      </TitleContainer>
      <ButtonGroup>
        <Button variant={'primary'} onClick={handleApprove}>{buttonTitle}</Button>
        {cancelButton && 
          <CancelButton variant={'default'} onClick={handleDecline}>
            Reject
          </CancelButton>
        }
      </ButtonGroup>
    </Container>
  );
};