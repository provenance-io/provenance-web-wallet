import styled from 'styled-components';
import { Button, Header, Typo, Content } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'redux/hooks';
import backupComplete from 'images/backup-complete.svg';

interface Props {
  nextUrl: string;
  flowType: 'create' | 'add' | 'recover';
}

const Image = styled.img`
  width: 160px;
  display: flex;
  margin: 50px auto;
`;

export const NewAccountSuccess = ({ nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const { clearTempAccount } = useAccount();
  const handleContinue = () => {
    // Remove temp data
    clearTempAccount();
    // Go to /dashboard
    navigate(nextUrl);
  };
  let message = '';
  let title = '';
  switch (flowType) {
    case 'add': {
      message = 'Account has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Account Added';
      break;
    }
    case 'create': {
      message = 'Wallet has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Wallet Created';
      break;
    }
    case 'recover': {
      message = 'Account has been successfully recovered.  Click continue to proceed to the dashboard.';
      title = 'Account Recovered';
      break;
    }
    default: break;
  }
  return (
    <Content>
      <Header progress={100} title={title} iconLeft='none' />
      <Image src={backupComplete} />
      <Typo type='body'>{message}</Typo>
      <Button onClick={handleContinue}>Continue</Button>
    </Content>
  );
};
