import styled from 'styled-components';
import { Button, Typo, FullPage } from 'Components';
import backupComplete from 'images/backup-complete.svg';
import type { FlowType } from 'types';

interface Props {
  flowType: FlowType;
}

const Image = styled.img`
  width: 160px;
  display: flex;
  margin: 0px auto;
`;

export const NewAccountSuccess = ({ flowType }: Props) => {
  const handleContinue = () => {
    // Close the current tab
    chrome.tabs.getCurrent((tab) => {
      if (tab?.id) chrome.tabs.remove(tab.id);
    });
  };
  let message = '';
  let title = '';
  switch (flowType) {
    case 'sub': {
      message =
        'Account has been successfully created.  You can safely close this tab and open the extension to access your new account.';
      title = 'Sub Account Added';
      break;
    }
    case 'create': {
      message =
        'Wallet has been successfully created. You can safely close this tab and open the extension to access your new account.';
      title = 'Wallet Created';
      break;
    }
    case 'add': {
      message =
        'Account has been successfully created. You can safely close this tab and open the extension to access your new account.';
      title = 'Account Created';
      break;
    }
    case 'recover': {
      message =
        'Account has been successfully recovered. You can safely close this tab and open the extension to access your new account.';
      title = 'Account Recovered';
      break;
    }
    case 'import': {
      message =
        'Account has been successfully imported. You can safely close this tab and open the extension to access your new account.';
      title = 'Account Imported';
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
      <Button onClick={handleContinue}>Exit</Button>
    </FullPage>
  );
};
