import { useWalletConnect } from 'redux/hooks';
import { Content, BottomFloat, Button, Typo, ImageContainer } from 'Components';
import txErrorImg from 'images/tx-error.svg';
import { EventPayload } from 'types';
import { useEffect, useState } from 'react';

interface Props {
  payload: EventPayload | null;
  closeWindow: () => void;
}

export const Disconnected: React.FC<Props> = ({ payload, closeWindow }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const { connector, removePendingRequest, bumpWCDuration } = useWalletConnect();

  // If we landed here, something went wrong, kill the request
  useEffect(() => {
    // Make sure we only load this once
    if (connector && initialLoad && payload && payload.jsonrpc && payload.id) {
      setInitialLoad(false);
      (async () => {
        await connector.rejectRequest({
          error: { message: 'Disconnected' },
          id: payload.id,
          jsonrpc: payload.jsonrpc,
        });
        await removePendingRequest(payload.id);
      })();
    }
  }, [connector, payload, removePendingRequest, initialLoad]);

  const handleClose = async () => {
    await bumpWCDuration();
    closeWindow();
  };

  return (
    <Content>
      <Typo type="headline2" marginBottom="80px">
        Disconnected
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={txErrorImg}
        alt="Transaction Failed"
      />
      <Typo type="body" marginTop="60px">
        You've been disconnected from the dApp.
      </Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
