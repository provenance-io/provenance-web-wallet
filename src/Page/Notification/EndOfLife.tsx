import { Typo, Content, BottomFloat, Button } from 'Components';
import { useSettings, useWalletConnect } from 'redux/hooks';

interface Props {
  payload: any;
  closeWindow: () => void;
}

export const EndOfLife: React.FC<Props> = ({ closeWindow, ...rest }) => {
  const { saveSettingsData } = useSettings();
  const { bumpWCDuration, removeNotificationRequest } = useWalletConnect();

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleClose = async () => {
    closeWindow();
    bumpWCDuration();
    // something else is also saving settings at the same time
    // so wait some time and then save the setting to prevent it from being overwritten
    await delay(1000);
    await saveSettingsData({ eolSeen: true });
    await removeNotificationRequest('eolSeen' as any);
  };

  return (
    <Content>
      <Typo type="headline2" marginBottom="80px">
        Provenance Blockchain Wallet Announcement
      </Typo>
      <Typo type="body" marginTop="60px">
        The Provenance Blockchain Wallet is being discontinued. Please install the
        Figure Wallet from{' '}
        <a
          href="https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc"
          target="_blank"
          rel="noreferrer"
        >
          Chrome Extension store
        </a>
        . Figure Wallet supports your existing assets and functionality that
        Provenance Blockchain Wallet supports. Using your seed phrase, you can
        recover your existing Provenance Blockchain assets in the Figure Wallet
      </Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
