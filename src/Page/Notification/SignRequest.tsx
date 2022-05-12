import { EventPayload } from 'types';
import styled from 'styled-components';
import { convertHexToUtf8, convertHexToBuffer } from "@walletconnect/utils";
import { Authenticate } from './Authenticate';
import { useWalletConnect } from 'redux/hooks';
import { List } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { signBytes } from 'utils';
import { removePendingRequest } from 'utils';

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
}

export const SignRequest:React.FC<Props> = ({ payload, closeWindow }) => {
  const { connector } = useWalletConnect();
  const [parsedParams, setParsedParams] = useState<ParsedParams>({});
  const [encodedMessage, setEncodedMessage] = useState('');
  const [privateKey, setPrivateKey] = useState<Uint8Array>();
    
  // Onload, pull out and parse payload params
  useEffect(() => {
    console.log('SignRequest | useEffect | payload: ', payload);
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

  const handleApprove = async () => {
    if (connector && privateKey && encodedMessage) {
      console.log('SignRequest | handleApprove | encodedMessage: ', encodedMessage); // Hex
      const bites = convertHexToBuffer(encodedMessage);
      console.log('SignRequest | handleApprove | bites: ', bites); // Uint8Array(41)
      console.log('SignRequest | handleApprove | privateKey: ', privateKey); // Uint8Array(32)
      // const result = signMessage({
      //   msgAny: encodedMessage,
      //   account: parsedParams.address,
      //   chainId,
      //   wallet,
      //   memo = '',
      //   feeDenom = 'nhash',
      //   gasPrice,
      //   gasAdjustment = 1.25,
      // });
      const signature = signBytes(bites, privateKey);
      // TEST: mobile app has a result that looks like this:
      // b56456d055222fc6bb100d53b9b1c524b27290c2a9d548b07207da6b46b84132478b41d69138d532a3e34b8eb61771ff6b9514de1c68887cbc605188951b1f06
      // Current iteration returns:
      // ML/diB/uVhsswVnvpL+4F4fR8DQ0DNuqkOlfgzTXzxgvqwj32ULsfsLCx7ngA13iyi3MS40N1fBcov++9YGpSA==
      const result = Buffer.from(signature).toString('base64');
      console.log('handleApprove | result: ', result);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      });
      const pendingId = `${payload.date}_${payload.id}`;
      await removePendingRequest(pendingId);
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
      const pendingId = `${payload.date}_${payload.id}`;
      await removePendingRequest(pendingId);
      // Close the popup
      closeWindow();
    }
  }
  const handleAuth = (privateKey: Uint8Array) => {
    setPrivateKey(privateKey);
  }

  const ListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    address: parsedParams?.address || 'N/A',
    created: payload?.date ? format(new Date(payload.date), 'MMM d, h:mm a') : 'N/A',
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
