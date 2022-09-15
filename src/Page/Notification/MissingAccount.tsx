import { EventPayload } from 'types';
import { useWalletConnect } from 'redux/hooks';
import {
  Content,
  BottomFloat,
  Button,
  Typo,
  ImageContainer,
  Sprite,
} from 'Components';
import extensionClickImage from 'images/extension-click.jpg';
import { useEffect, useState } from 'react';
import { COLORS } from 'theme';
import styled from 'styled-components';

interface Props {
  payload: EventPayload | null;
  closeWindow: () => void;
}

const CenterSprite = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
      <Typo type="headline2" marginBottom="60px">
        Set up your Account
      </Typo>
      <CenterSprite>
        <Sprite
          viewBox="-8 0 60 60"
          icon="ICON::PROVENANCE"
          size="60px"
          color={COLORS.PRIMARY_500}
        />
      </CenterSprite>
      <Typo type="subhead" marginTop="40px" marginBottom="60px" bold>
        Close this window and open the Provenance Blockchain Wallet Chrome extension
        to set up your account.
      </Typo>
      <ImageContainer
        size="332px"
        centered
        src={extensionClickImage}
        alt="Action Failed"
      />
      <BottomFloat>
        <Button onClick={handleClose}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
