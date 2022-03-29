import { InfoText, Title, Button, Header } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import recoverIntro from 'images/recover-intro.svg';

const Wrapper = styled.div`
  padding: 30px 16px 48px 16px;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;
const Group = styled.div`
  flex-grow: 1;
`;
const Image = styled.img`
  margin-top: 50px;
  margin-bottom: 200px;
  width: 160px;
`;

export const RecoverNote = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Group>
        <Header title="Name Your Account" progress={66} />
        <Title size="1.6rem" weight={600}>Recover Account</Title>
        <InfoText margin="16px auto 0 auto">In the following steps, you'll enter your 25-word recovery passphrase to recover your account</InfoText>
        <Image src={recoverIntro} />
      </Group>
      <Button variant='primary' onClick={() => navigate('../seed')}>Continue</Button>
    </Wrapper>
  );
};
