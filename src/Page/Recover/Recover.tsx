import { InfoText, Title, Button } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import recoverIntro from 'images/recover-intro.svg';

const Wrapper = styled.div`
  background: #1A1C23;
  min-height: 100vh;
  height: 100%;
  padding: 30px 16px 48px 16px;
  text-align: center;
`;
const Image = styled.img`
  margin-top: 50px;
  margin-bottom: 200px;
  width: 160px;
`;
const BackArrow = styled.div`
  font-weight:300;
  font-size: 1.9rem;
  text-align: left;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
`;

export const Recover = () => {
  const navigate = useNavigate();

  const backClick = () => { navigate(-1) };

  return (
    <Wrapper>
      <BackArrow onClick={backClick}>{'<'}</BackArrow>
      <Title size="1.6rem" weight={600}>Recover Account</Title>
      <InfoText margin="16px auto 0 auto">In the following steps, you'll enter your 25-word recovery passphrase to recover your account</InfoText>
      <Image src={recoverIntro} />
      <Button variant='primary'>Continue</Button>
    </Wrapper>
  );
};
