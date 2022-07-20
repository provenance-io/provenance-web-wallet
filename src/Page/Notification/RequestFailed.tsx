import { EventPayload } from 'types';
import { useWalletConnect } from 'redux/hooks';
import { Content, BottomFloat, Button, Typo, ImageContainer } from 'Components';
import txErrorImg from 'images/tx-error.svg';
import { useEffect, useState } from 'react';

interface Props {
  payload: EventPayload | null,
  failedMessage: string,
  closeWindow: () => void,
  title?: string,
}

export const RequestFailed:React.FC<Props> = ({ payload, closeWindow, failedMessage, title = 'Transaction Failed'}) => {
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
    if (connector && initialLoad && payload) {
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
    // Only bump/update the time if all connection values exist and are not already expired
    const connectionTimersExist = (connectionEXP && connectionDuration);
    if (connectionTimersExist) {
      const now = Date.now();
      const hasExpired = now > connectionEXP;
      if (!hasExpired) {
        const newConnectionEXP = now + connectionDuration;
        await saveWalletconnectData({ connectionEXP: newConnectionEXP });
      }
    }
  };

  const handleClose = async () => {
    await bumpWalletConnectTimeout();
    closeWindow();
  }

  return (
    <Content>
      <Typo type="headline2" marginBottom='80px'>{title}</Typo>
      <ImageContainer size="140px" centered src={txErrorImg} alt="Transaction Failed" />
      <Typo type="body" marginTop='60px'>{failedMessage}</Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
