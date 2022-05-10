import { EventPayload } from 'types';
import styled from 'styled-components';
import { convertHexToUtf8, convertHexToBuffer } from "@walletconnect/utils";
import { Authenticate } from './Authenticate';
import { useWalletConnect } from 'redux/hooks';
import { List } from 'Components';
import { useEffect, useState } from 'react';
// import { signMessage } from 'utils';

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
  payload: EventPayload
}
interface ParsedParams {
  address?: string,
  description?: string,
  payload?: string,
}

export const SignRequest:React.FC<Props> = ({ payload }) => {
  const { connector } = useWalletConnect();
  const [parsedParams, setParsedParams] = useState<ParsedParams>({});
  const [encodedMessage, setEncodedMessage] = useState('');
  const [privateKey, setPrivateKey] = useState<Uint8Array>();
  console.log('SignRequest | payload :', payload);
  console.log('SignRequest | connector :', connector);
    
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

  const closeWindow = async () => {
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.id) {
      chrome.windows.remove(currentWindow.id);
    } else {
      window.close();
    }
  };

  const handleApprove = async () => {
    if (connector && privateKey && encodedMessage) {
      console.log('handleApprove | encodedMessage: ', encodedMessage);
      const bites = convertHexToBuffer(encodedMessage);
      console.log('handleApprove | bites: ', bites);
      console.log('handleApprove | privateKey: ', privateKey);
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
      const result = 'result'
      console.log('handleApprove | result: ', result);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      })
      // Close the popup TEMP: UNCOMMENT THIS
      // closeWindow();
    }
  }
  const handleDecline = async () => {
    if (connector) {
      await connector.rejectRequest({
        error: { message: 'Sign request rejected by user' },
        id: payload.id,
        jsonrpc: payload.jsonrpc,
      });
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
    created: '[Data_Missing]',
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
