import { InfoText, Title, Button, Header } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import recoverIntro from 'images/recover-intro.svg';

const Group = styled.div`
  flex-grow: 1;
`;
const Image = styled.img`
  margin-top: 50px;
  width: 160px;
`;

interface Props {
  nextUrl: string,
}

export const RecoverNote:React.FC<Props> = ({ nextUrl }) => {
  const navigate = useNavigate();

  return (
    <>
      <Group>
        <Header title="Name Your Account" progress={66} />
        <Title size="1.6rem" weight={600}>Recover Account</Title>
        <InfoText margin="16px auto 0 auto">In the following steps, you'll enter your 24-word recovery passphrase to recover your account</InfoText>
        <InfoText margin="16px auto 0 auto">Provenance Blockchain Wallet will add accounts in order, starting from 0, and stop once an account has 0 HASH</InfoText>
        <Image src={recoverIntro} />
      </Group>
      <Button variant='primary' onClick={() => navigate(nextUrl)}>Continue</Button>
    </>
  );
};
