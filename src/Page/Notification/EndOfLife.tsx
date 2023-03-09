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
      <Typo type="headline2" marginBottom="20px">
        Notice
      </Typo>
      <Typo type="body" marginTop="20px">
        With the availability other integrated wallets we are discontinuing support
        for the Provenance Blockchain Wallet.
      </Typo>

      <Typo type="body" marginTop="20px">
        <a
          href="https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc"
          target="_blank"
          rel="noreferrer"
        >
          Figure
        </a>{' '}
        and{' '}
        <a href="https://chains.keplr.app/" target="_blank" rel="noreferrer">
          Keplr
        </a>{' '}
        wallets are currently integrated with Provenance Blockchain. The Provenance
        Blockchain Foundation is actively broadening the number of integrated
        wallets.
      </Typo>

      <Typo type="body" marginTop="20px">
        Your Provenance Blockchain Wallet will continue to be available for use,
        although it is recommended to transition to either a Figure or Keplr wallet.
      </Typo>

      <Typo type="body" marginTop="20px">
        Figure Wallet offers an import feature to seamlessly retrieve your Provenance
        Blockchain Wallet holdings. Please visit the{' '}
        <a
          href="https://chrome.google.com/webstore/detail/figure-wallet/mgbfflhghaohmaecmaggieniidindaoc"
          target="_blank"
          rel="noreferrer"
        >
          Chrome Extension store
        </a>{' '}
        to get started.
      </Typo>

      <Typo type="body" marginTop="20px">
        Please contact{' '}
        <a href="mailto:inbound@provenance.io">inbound@provenance.io</a> with any
        questions.
      </Typo>

      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
