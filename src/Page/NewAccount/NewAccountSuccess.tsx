import styled from 'styled-components';
import { Button, Header, Typo, Content, BottomFloat } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'redux/hooks';
import backupComplete from 'images/backup-complete.svg';
import { FlowType } from 'types';

interface Props {
  nextUrl: string;
  flowType: FlowType;
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
    case 'sub': {
      message = 'Account has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Sub Account Added';
      break;
    }
    case 'create': {
      message = 'Wallet has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Wallet Created';
      break;
    }
    case 'add': {
      message = 'Account has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Account Created';
      break;
    }
    case 'recover': {
      message = 'Account has been successfully recovered.  Click continue to proceed to the dashboard.';
      title = 'Account Recovered';
      break;
    }
    case 'import': {
      message = 'Account has been successfully imported.  Click continue to proceed to the dashboard.';
      title = 'Account Imported';
      break;
    }
    default: break;
  }
  return (
    <Content>
      <Header progress={100} title={title} iconLeft='none' />
      <Image src={backupComplete} />
      <Typo type='body'>{message}</Typo>
      <BottomFloat>
        <Button onClick={handleContinue}>Continue</Button>
      </BottomFloat>
    </Content>
  );
};
