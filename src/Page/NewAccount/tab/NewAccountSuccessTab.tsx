import styled from 'styled-components';
import { Button, Typo, FullPage } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'redux/hooks';
import backupComplete from 'images/backup-complete.svg';
import type { FlowType } from 'types';

interface Props {
  nextUrl: string;
  flowType: FlowType;
}

const Image = styled.img`
  width: 160px;
  display: flex;
  margin: 0px auto;
`;

export const NewAccountSuccessTab = ({ nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const { clearTempAccount } = useAccount();
  const handleContinue = () => {
    // Remove temp data
    clearTempAccount();
    // Go to /dashboard
    window.location.hash = '';
    navigate(nextUrl);
  };
  let message = '';
  let title = '';
  switch (flowType) {
    case 'create': {
      message =
        'Wallet has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Wallet Created';
      break;
    }
    case 'add': {
      message =
        'Account has been successfully created.  Click continue to proceed to the dashboard.';
      title = 'Account Created';
      break;
    }
    default:
      break;
  }
  return (
    <FullPage title={title}>
      <Image src={backupComplete} />
      <Typo type="body" marginBottom="40px" marginTop="30px" align="left">
        {message}
      </Typo>
      <Button onClick={handleContinue}>Continue</Button>
    </FullPage>
  );
};
