import { EventPayload } from 'types';
import styled from 'styled-components';
import { convertHexToUtf8, convertHexToBuffer, convertArrayBufferToHex } from "@walletconnect/utils";
import {
  unpackDisplayObjectFromWalletMessage,
  buildBroadcastTxRequest,
  broadcastTx,
  SupportedDenoms,
  getAccountInfo,
} from '@provenanceio/wallet-utils';
import { useWalletConnect } from 'redux/hooks';
import { List, Authenticate } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { signBytes, txMessageFormat, getTxFeeEstimate, getGrpcApi, getChainId } from 'utils';
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
interface ParsedMetadata {
  address?: string,
  description?: string,
  messageAnyB64?: string,
  date?: number,
  memo?: string,
  gasPrice?: {
    gasPrice: number,
    gasPriceDenom: SupportedDenoms,
  };
  type?: string,
}
interface ParsedTxMessage { [fieldName: string]: any };

export const SendTransaction:React.FC<Props> = ({ payload, closeWindow }) => {
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletconnectData,
    removePendingRequest,
  } = useWalletConnect();
  const [parsedMetadata, setParsedMetadata] = useState<ParsedMetadata>({});
  const [parsedTxMessage, setParsedTxMessage] = useState<ParsedTxMessage>({});
  const [txMsgAny, setTxMsgAny] = useState<any>({});
  const [encodedMessage, setEncodedMessage] = useState('');

  // Onload, pull out and parse payload params
  useEffect(() => {
    const { params } = payload; // payload = { ..., params: [metadata, hexMessage] }
    const [metadataString, hexEncodedMessage] = params as string[];
    setEncodedMessage(hexEncodedMessage);
    const metadata = JSON.parse(metadataString);
    const messageAnyB64 = convertHexToUtf8(hexEncodedMessage);
    let txMsg;
    if (messageAnyB64) {
      const msgObj = unpackDisplayObjectFromWalletMessage(messageAnyB64);
      txMsg = txMessageFormat(msgObj);
      setTxMsgAny(txMsg);
      console.log('msgObj :', msgObj);
      console.log('txMsg :', txMsg);
      console.log('metadata :', metadata);
    }
    setParsedMetadata(metadata)
    setParsedTxMessage(txMsg as ParsedTxMessage);
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
    const address = parsedMetadata.address!;
    const privateKey = masterKey.privateKey!;
    const publicKey = masterKey.publicKey;
    const wallet = { address, privateKey, publicKey };
    const grpcAddress = getGrpcApi(address);
    const chainId = getChainId(address);
    const { baseAccount } = await getAccountInfo(address, grpcAddress);
    const {txFeeEstimate, txGasEstimate} = await getTxFeeEstimate({
      address,
      publicKey,
      msgAny: txMsgAny,
    });
    const broadcastTxRequest = buildBroadcastTxRequest({
      account: baseAccount,
      chainId,
      feeDenom: parsedMetadata!.gasPrice!.gasPriceDenom,
      feeEstimate: txFeeEstimate!,
      gasEstimate: parsedMetadata!.gasPrice!.gasPrice || txGasEstimate,
      memo: parsedMetadata.memo || '',
      msgAny: txMsgAny,
      wallet,
    });

    await broadcastTx(grpcAddress, broadcastTxRequest);


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

  const metadataListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    'Gas Fee': `${parsedMetadata?.gasPrice?.gasPrice} ${parsedMetadata?.gasPrice?.gasPriceDenom}` || 'N/A',
    '@type': parsedMetadata?.type || 'N/A',
    date: parsedMetadata?.date ? format(new Date(parsedMetadata.date), 'MMM d, h:mm a') : 'N/A',
    description: parsedMetadata?.description || 'N/A',
  };
  const txMsgListItems = {...parsedTxMessage};

  const ListItems = {
    ...metadataListItems,
    ...txMsgListItems,
  };

  return (
    <SignContainer>
      <Title>Transaction</Title>
      <List message={ListItems} />
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        approveText="Sign Message"
      />
    </SignContainer>
  );
};
