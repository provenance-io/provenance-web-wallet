import { EventPayload } from 'types';
import { useWalletConnect } from 'redux/hooks';
import { Content, BottomFloat, Button, Typo, ImageContainer } from 'Components';
import txErrorImg from 'images/tx-error.svg';
import { useEffect, useState } from 'react';

interface Props {
  payload: EventPayload,
  failedMessage: string,
  closeWindow: () => void,
}

export const RequestFailed:React.FC<Props> = ({ payload, closeWindow, failedMessage }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletconnectData,
    removePendingRequest,
  } = useWalletConnect();

  // If we landed here, something went wrong, kill the request
  useEffect(() => {
    // Make sure we only load this once
    if (connector && initialLoad) {
      setInitialLoad(false);
      (async () => {
        await connector.rejectRequest({
          error: { message: failedMessage },
          id: payload.id,
          jsonrpc: payload.jsonrpc,
        });
        await removePendingRequest(payload.id);
      })()
    }
  }, [ connector, failedMessage, payload, removePendingRequest, initialLoad]);

  // TODO: Move bumpWalletConnectTimeout to redux method (DRY)
  // Connection to the dApp is on a timer, whenever the user interacts with the dApp (approve/deny) reset the timer
  const bumpWalletConnectTimeout = async () => {
    // Only bump/update the time if all connection values exist
    if (connectionEXP && connectionDuration) {
      const now = Date.now();
      const newConnectionEXP = now + connectionDuration;
      await saveWalletconnectData({ connectionEXP: newConnectionEXP });
    }
  };

  const handleClose = async () => {
    await bumpWalletConnectTimeout();
    closeWindow();
  }

  return (
    <Content>
      <Typo type="headline2" marginBottom='80px'>Transaction Failed</Typo>
      <ImageContainer size="140px" centered src={txErrorImg} alt="Transaction Failed" />
      <Typo type="body" marginTop='60px'>Unable to initiate transaction: {failedMessage}</Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
