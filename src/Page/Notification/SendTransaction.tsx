import { EventPayload } from 'types';
import styled from 'styled-components';
import { convertHexToUtf8, convertHexToBuffer, convertArrayBufferToHex, convertUtf8ToBuffer } from "@walletconnect/utils";
import { msgAnyB64toAny, unpackDisplayObjectFromWalletMessage } from '@provenanceio/wallet-utils';
import { useWalletConnect } from 'redux/hooks';
import { List, Authenticate } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { signBytes, bytesToJSON } from 'utils';
import { BIP32Interface } from 'types';

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
  messageAnyB64?: string,
  date?: number,
}

export const SendTransaction:React.FC<Props> = ({ payload, closeWindow }) => {
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletconnectData,
    removePendingRequest,
  } = useWalletConnect();
  const [parsedParams, setParsedParams] = useState<ParsedParams>({});
  const [encodedMessage, setEncodedMessage] = useState('');

  // Onload, pull out and parse payload params
  useEffect(() => {
    const { params } = payload; // payload = [metadata, hexMessage]
    const [metadataString, hexEncodedMessage] = params as string[];
    setEncodedMessage(hexEncodedMessage);
    const metadata = JSON.parse(metadataString);
    const messageAnyB64 = convertHexToUtf8(hexEncodedMessage);
    if (messageAnyB64) {
      const msgAny = msgAnyB64toAny(messageAnyB64);
      console.log('msgAny :', msgAny);
      const msgObj = unpackDisplayObjectFromWalletMessage(messageAnyB64);
      console.log('msgObj :', msgObj);
      // const msgBuffer = convertUtf8ToBuffer(msgValueUInt8Array);
      // const msgString = msgBuffer.toString('utf8');
      // const msgJSON = JSON.parse(msgString);
      // console.log('msgBuffer :', msgBuffer);
      // console.log('msgString :', msgString);
      // console.log('msgJSON :', msgJSON);
    }
    setParsedParams({
      ...metadata,
      messageAnyB64,
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

  // 1) Loop through each item in params

  // How is the message packaged up? (use sendCoin as an example)
  /*
    const metadata = JSON.stringify({
      description,
      address,
      gasPrice,
      date: Date.now(),
    });
    const request = {
      id: rngNum(),
      jsonrpc: '2.0',
      method,
      params: [metadata],
    };
    const sendMessage = {
      fromAddress: address,
      toAddress,
      amountList: [{ denom, amount: amountString }],
    };
  */
  // const type = 'MsgSend';
  // const messageMsgSend = buildMessage(type, sendMessage);
  // const message = createAnyMessageBase64(type, messageMsgSend as Message);
  // const hexMsg = convertUtf8ToHex(message);
  // request.params.push(hexMsg);
  // const result = await connector.sendCustomRequest(request);


  const ListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    address: parsedParams?.address || 'N/A',
    created: parsedParams?.date ? format(new Date(parsedParams.date), 'MMM d, h:mm a') : 'N/A',
    'message type': 'provenance_sign',
    description: parsedParams?.description || 'N/A',
  };

  return (
    <SignContainer>
      <Title>Sign Request</Title>
      <List message={ListItems} />
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        approveText="Sign Message"
      />
    </SignContainer>
  );
};
