import { Typo, Content, BottomFloat, Button } from 'Components';
import styled from 'styled-components';
import circleIcon from 'images/circle-icon.svg';
import { useSettings, useWalletConnect } from 'redux/hooks';

interface Props {
  payload: any;
  closeWindow: () => void;
}

const SuccessIcon = styled.img`
  height: 80px;
  width: 80px;
  display: flex;
  margin: 0 auto;
  margin-top: 30px;
`;

export const EndOfLife: React.FC<Props> = ({ closeWindow, ...rest }) => {
  const { saveSettingsData } = useSettings();
  const { bumpWCDuration, removePendingRequest } = useWalletConnect();

  const onClose = async () => {
    closeWindow();
    saveSettingsData({ eolSeen: true });
    await removePendingRequest('eolSeen' as any);
    bumpWCDuration();
  };

  return (
    <Content>
      <SuccessIcon src={circleIcon} />
      <Typo type="title" align="center" marginTop="20px">
        Provenance Blockchain Wallet Announcement
      </Typo>
      <Typo type="displayBody" align="center" marginTop="14px" marginBottom="20px">
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
        <Button onClick={onClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
