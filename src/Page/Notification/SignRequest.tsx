import { EventPayload } from 'types';
import styled from 'styled-components';
import { convertHexToUtf8, convertHexToBuffer, convertArrayBufferToHex } from "@walletconnect/utils";
import { useWalletConnect } from 'redux/hooks';
import { List, Authenticate } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { signBytes } from 'utils';

const SignContainer = styled.div`
  padding-bottom: 300px;
`;

const Title = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.32em;
  line-height: 20px;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
`;

interface Props {
  payload: EventPayload,
  closeWindow: () => void,
}
interface ParsedParams {
  address?: string,
  description?: string,
  payload?: string,
  date?: number,
}

export const SignRequest:React.FC<Props> = ({ payload, closeWindow }) => {
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletconnectData,
    removePendingRequest,
  } = useWalletConnect();
  const [parsedParams, setParsedParams] = useState<ParsedParams>({});
  const [encodedMessage, setEncodedMessage] = useState('');
  const [privateKey, setPrivateKey] = useState<Uint8Array>();

  // Onload, pull out and parse payload params
  useEffect(() => {
    const { params } = payload;
    const [detailsJSONString, hexEncodedMessage] = params as string[];
    setEncodedMessage(hexEncodedMessage);
    const details = JSON.parse(detailsJSONString);
    const decodedMessage = convertHexToUtf8(hexEncodedMessage);
    setParsedParams({
      ...details,
      payload: decodedMessage,
    })
  }, [payload]);

  // Connection to the dApp is on a timer, whenever the user interacts with the dApp (approve/deny) reset the timer
  const bumpWalletConnectTimeout = async () => {
    // Only bump/update the time if all connection values exist
    if (connectionEXP && connectionDuration) {
      const now = Date.now();
      const newConnectionEXP = now + connectionDuration;
      await saveWalletconnectData({ connectionEXP: newConnectionEXP });
    }
  };

  const handleApprove = async () => {
    if (connector && privateKey && encodedMessage) {
      const bites = convertHexToBuffer(encodedMessage);
      const signature = signBytes(bites, privateKey);
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
  }
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
  }
  const handleAuth = (privateKey: Uint8Array) => {
    setPrivateKey(privateKey);
  }

  const ListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    address: parsedParams?.address || 'N/A',
    created: parsedParams?.date ? format(new Date(parsedParams.date), 'MMM d, h:mm a') : 'N/A',
    'message type': 'provenance_sign',
    description: parsedParams?.description || 'N/A',
    payload: parsedParams?.payload || 'N/A',
  };

  return (
    <SignContainer>
      <Title>Sign Request</Title>
      <List message={ListItems} />
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        handleAuth={handleAuth}
      />
    </SignContainer>
  );
};
