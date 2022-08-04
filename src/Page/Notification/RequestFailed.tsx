import { EventPayload } from 'types';
import { useWalletConnect } from 'redux/hooks';
import { Content, BottomFloat, Button, Typo, ImageContainer } from 'Components';
import txErrorImg from 'images/tx-error.svg';
import { useEffect, useState } from 'react';

interface Props {
  payload: EventPayload | null;
  pageData: {
    failedMessage?: string;
    title?: string;
  };
  closeWindow: () => void;
}

export const RequestFailed: React.FC<Props> = ({
  payload,
  closeWindow,
  pageData,
}) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const { connector, removePendingRequest, bumpWCDuration } = useWalletConnect();
  const { failedMessage = 'Unknown Error Message', title = 'Unknown Error' } =
    pageData;

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
      })();
    }
  }, [connector, failedMessage, payload, removePendingRequest, initialLoad]);

  const handleClose = async () => {
    await bumpWCDuration();
    closeWindow();
  };

  return (
    <Content>
      <Typo type="headline2" marginBottom="80px">
        {title}
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={txErrorImg}
        alt="Transaction Failed"
      />
      <Typo type="body" marginTop="60px">
        {failedMessage}
      </Typo>
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
