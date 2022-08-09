import { EventPayload } from 'types';
import { useWalletConnect } from 'redux/hooks';
import { Content, BottomFloat, Button, Typo, ImageContainer } from 'Components';
import txErrorImg from 'images/tx-error.svg';
import { useEffect, useState } from 'react';

interface Props {
  payload: EventPayload | null;
  closeWindow: () => void;
}

export const MissingAccount: React.FC<Props> = ({ payload, closeWindow }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const { connector, removePendingRequest, bumpWCDuration } = useWalletConnect();

  // If we landed here, something went wrong, kill the request
  useEffect(() => {
    // Make sure we only load this once
    if (connector && initialLoad && payload) {
      setInitialLoad(false);
      (async () => {
        await connector.rejectRequest({
          error: { message: 'No wallet exists' },
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
        Unable to connect
      </Typo>
      <ImageContainer size="140px" centered src={txErrorImg} alt="Action Failed" />
      <Typo type="subhead" marginTop="60px" bold>
        Missing Wallet
      </Typo>
      <Typo type="body" marginTop="40px">
        Close this window and open the Provenance Blockchain Wallet extension to
        create a new wallet, then try again.
      </Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
