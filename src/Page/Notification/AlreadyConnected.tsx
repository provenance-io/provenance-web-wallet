import { useWalletConnect } from 'redux/hooks';
import {
  Content,
  BottomFloat,
  Button,
  Typo,
  ImageContainer,
  ButtonGroup,
  List,
  ScrollContainer,
} from 'Components';
import txErrorImg from 'images/tx-error.svg';

interface Props {
  closeWindow: () => void;
}

export const AlreadyConnected: React.FC<Props> = ({ closeWindow }) => {
  const { connector, bumpWCDuration } = useWalletConnect();

  const handleClose = async () => {
    await bumpWCDuration();
    closeWindow();
  };
  const handleDisconnect = async () => {
    if (connector) {
      await connector.killSession();
      closeWindow();
    }
  };
  const connectedAccountAddress = connector?.accounts[0]?.address || 'N/A';
  const connectedAccountName = connector?.accounts[0]?.walletInfo?.name || 'N/A';
  const connectedUrl = connector?.peerMeta?.url || 'N/A';
  const connectedPageName = connector?.peerMeta?.name || 'N/A';

  return (
    <Content>
      <Typo type="headline2" marginBottom="30px">
        Wallet Connection Exists
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={txErrorImg}
        alt="Connection Failed"
      />
      <Typo type="body" marginTop="30px" align="left" marginBottom="14px">
        Your wallet is already connected to another dApp. You may leave that
        connection open, or disconnect, then re-attempt to connect to the current
        dApp.
      </Typo>
      <ScrollContainer height="140px">
        <List
          message={{
            url: connectedUrl,
            page: connectedPageName,
            account: connectedAccountName,
            address: connectedAccountAddress,
          }}
        />
      </ScrollContainer>
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={handleDisconnect}>Disconnect</Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </BottomFloat>
    </Content>
  );
};
