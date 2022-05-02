import styled from 'styled-components';
import { Button, Header, BodyContent, Content } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'redux/hooks';
import backupComplete from 'images/backup-complete.svg';

interface Props {
  nextUrl: string;
}

const Image = styled.img`
  width: 160px;
  display: flex;
  margin: 50px auto;
`;

export const CreateComplete = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { clearTempWallet } = useAccount();
  const finishCreation = () => {
    // Remove temp data
    clearTempWallet();
    // Go to /dashboard
    navigate(nextUrl);
  };
  return (
    <Content>
      <Header progress={100} title="Wallet Created" iconLeft='none' />
      <Image src={backupComplete} />
      <BodyContent>
        Wallet has been successfully created.  Click continue to proceed to the dashboard.
      </BodyContent>
      <Button onClick={finishCreation}>Continue</Button>
    </Content>
  );
};
