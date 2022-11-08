import styled from 'styled-components';
import { Button, Typo, FullPage } from 'Components';
import { useAccount } from 'redux/hooks';
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

export const NewAccountSuccessTab = ({ flowType }: Props) => {
  const { clearTempAccount } = useAccount();
  const handleContinue = () => {
    // Remove temp data
    clearTempAccount();
    // Close the current tab
    chrome.tabs.getCurrent((tab) => {
      if (tab?.id) chrome.tabs.remove(tab.id);
    });
  };

  const accountType = flowType === 'add' ? 'Account' : 'Wallet';
  const message = `${accountType} has been successfully created. You can safely close this tab and open the extension to interact with this new account.`;
  const title = `${accountType} Created`;

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
