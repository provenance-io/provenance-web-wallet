import type { EventPayload, BIP32Interface, NotificationType } from 'types';
import styled from 'styled-components';
import { useWalletConnect } from 'redux/hooks';
import { List, Authenticate, Content, Typo } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  signBytes,
  convertHexToUtf8,
  convertHexToBuffer,
  convertArrayBufferToHex,
} from 'utils';

interface Props {
  payload: EventPayload;
  closeWindow: () => void;
  changeNotificationPage: (type: NotificationType, data: {}) => void;
}
interface ParsedParams {
  address?: string;
  description?: string;
  payload?: string;
  date?: number;
}
const PaginationDisplay = styled.div`
  position: fixed;
  bottom: 180px;
  font-size: 1.4rem;
  letter-spacing: 0.2em;
  display: flex;
  justify-content: center;
  width: 100%;
  left: 0;
`;

export const SignRequest: React.FC<Props> = ({
  payload,
  closeWindow,
  changeNotificationPage,
}) => {
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletConnectData,
    removePendingRequest,
  } = useWalletConnect();
  const [parsedParams, setParsedParams] = useState<ParsedParams>({});
  const [encodedMessage, setEncodedMessage] = useState('');

  // Onload, pull out and parse payload params
  useEffect(() => {
    const { params } = payload;
    // If we are disconnected, the params are changed into an object with a message stating "Session disconnected"
    // Normally, the message comes through and the value is a string, when it isn't do nothing
    if (typeof params[0] === 'string') {
      const [detailsJSONString, hexEncodedMessage] = params as string[];
      setEncodedMessage(hexEncodedMessage);
      const details = JSON.parse(detailsJSONString);
      // Use try/catch because this might not come through as a hex if the dApp messed up
      try {
        const decodedMessage = convertHexToUtf8(hexEncodedMessage);
        setParsedParams({
          ...details,
          payload: decodedMessage,
        });
      } catch (error) {
        changeNotificationPage('failed', {
          failedMessage: `${error}`,
          title: 'Signing Failed',
        });
      }
    }
  }, [payload, changeNotificationPage]);

  // Connection to the dApp is on a timer, whenever the user interacts with the dApp (approve/deny) reset the timer
  const bumpWalletConnectTimeout = async () => {
    // Only bump/update the time if all connection values exist
    if (connectionEXP && connectionDuration) {
      const now = Date.now();
      const newConnectionEXP = now + connectionDuration;
      await saveWalletConnectData({ connectionEXP: newConnectionEXP });
    }
  };

  const handleApprove = async (masterKey: BIP32Interface) => {
    if (connector && masterKey && encodedMessage) {
      const bites = convertHexToBuffer(encodedMessage);
      const signature = signBytes(bites, masterKey.privateKey!);
      // Convert back to hex
      const resultFull = convertArrayBufferToHex(signature);
      // Cut off the leading "0x"
      const result = resultFull.slice(2, resultFull.length);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      });
      await removePendingRequest(payload.id);
      await bumpWalletConnectTimeout();
      closeWindow();
    }
  };
  const handleDecline = async () => {
    if (connector) {
      await connector.rejectRequest({
        error: { message: 'Sign request rejected by user' },
        id: payload.id,
        jsonrpc: payload.jsonrpc,
      });
      await removePendingRequest(payload.id);
      await bumpWalletConnectTimeout();
      closeWindow();
    }
  };

  const ListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    address: parsedParams?.address || 'N/A',
    created: parsedParams?.date
      ? format(new Date(parsedParams.date), 'MMM d, h:mm a')
      : 'N/A',
    'message type': 'provenance_sign',
    description: parsedParams?.description || 'N/A',
    payload: parsedParams?.payload || 'N/A',
  };

  return (
    <Content>
      <Typo marginBottom="20px" type="headline2">
        Sign Request
      </Typo>
      <List message={ListItems} maxHeight="324px" />
      <PaginationDisplay>1/1</PaginationDisplay>
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        approveText="Sign Message"
      />
    </Content>
  );
};
