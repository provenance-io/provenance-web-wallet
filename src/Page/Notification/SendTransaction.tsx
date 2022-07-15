import { EventPayload } from 'types';
import styled from 'styled-components';
import {
  unpackDisplayObjectFromWalletMessage,
  buildBroadcastTxRequest,
  broadcastTx,
  SupportedDenoms,
  getAccountInfo,
  msgAnyB64toAny,
} from '@provenanceio/wallet-utils';
import { useAccount, useWalletConnect } from 'redux/hooks';
import { List, Authenticate } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { txMessageFormat, getTxFeeEstimate, getGrpcApi, getChainId, convertHexToUtf8, hashFormat } from 'utils';
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
  const { accounts } = useAccount();
  const [parsedMetadata, setParsedMetadata] = useState<ParsedMetadata>({});
  const [parsedTxMessage, setParsedTxMessage] = useState<ParsedTxMessage>({});
  const [txMsgAny, setTxMsgAny] = useState<any>({});
  const [txType, setTxType] = useState<string>('');
  const [txFeeEstimate, setTxFeeEstimate] = useState<number>(0);
  const [txGasEstimate, setTxGasEstimate] = useState<number>(0);
  const [initialLoad, setInitialLoad] = useState(true);

  // Onload, pull out and parse payload params
  useEffect(() => {
    if (initialLoad) {
      // Only run this once
      setInitialLoad(false);
      const { params } = payload; // payload = { ..., params: [metadata, hexMessage] }
      const [metadataString, hexEncodedMessage] = params as string[];
      const newParsedMetadata = JSON.parse(metadataString);
      const messageAnyB64 = convertHexToUtf8(hexEncodedMessage);
      const msgAny = msgAnyB64toAny(messageAnyB64);
      setTxType(msgAny.getTypeName());
      setTxMsgAny(msgAny);
      let txMsg;
      if (messageAnyB64) {
        const msgObj = unpackDisplayObjectFromWalletMessage(messageAnyB64);
        txMsg = txMessageFormat(msgObj);
      }

      setParsedMetadata(newParsedMetadata)
      setParsedTxMessage(txMsg as ParsedTxMessage);
      // Calculate the tx and gas fees
      (async () => {
        const address = newParsedMetadata.address!;
        const targetAccount = accounts.find(({ address: storeAddress }) => storeAddress === address);
        if (targetAccount) {
          const {txFeeEstimate, txGasEstimate} = await getTxFeeEstimate({
            address,
            publicKey: targetAccount.publicKey!,
            msgAny,
            gasPrice: newParsedMetadata?.gasPrice?.gasPrice,
            gasPriceDenom: newParsedMetadata?.gasPrice?.gasPriceDenom,
          });
          console.log('txFeeEstimate :', txFeeEstimate);
          console.log('txGasEstimate :', txGasEstimate);
          setTxFeeEstimate(txFeeEstimate);
          setTxGasEstimate(txGasEstimate);
        }
      })();
    }
  }, [payload, parsedMetadata, txMsgAny, accounts, initialLoad]);

  // TODO: Move bumpWalletConnectTimeout to redux method (DRY)
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
    // Connector must exist to respond to request
    if (connector) {
      const address = parsedMetadata.address!;
      const privateKey = masterKey.privateKey!;
      const publicKey = masterKey.publicKey;
      const wallet = { address, privateKey, publicKey };
      const grpcAddress = getGrpcApi(address);
      const chainId = getChainId(address);
      const { baseAccount } = await getAccountInfo(address, grpcAddress);
      const broadcastTxRequest = buildBroadcastTxRequest({
        account: baseAccount,
        chainId,
        feeDenom: parsedMetadata!.gasPrice!.gasPriceDenom || 'nhash',
        feeEstimate: txFeeEstimate,
        gasEstimate: txGasEstimate,
        memo: parsedMetadata.memo || '',
        msgAny: txMsgAny,
        wallet,
      });
      const result = await broadcastTx(grpcAddress, broadcastTxRequest);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      });
      await removePendingRequest(payload.id);
      await bumpWalletConnectTimeout();
      // TODO: Create success page
      closeWindow();
    };
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

  const formatMetadataGasFee = () => {
    const gasPriceDenom = parsedMetadata?.gasPrice?.gasPriceDenom || 'nhash';
    return gasPriceDenom === 'nhash' ?
        `${(hashFormat(txFeeEstimate, 'nhash') + hashFormat(txGasEstimate!, 'nhash')).toFixed(4)} Hash` :
        `${(txFeeEstimate + txGasEstimate).toFixed(3)} ${gasPriceDenom}`;
  }
  const metadataListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    'Gas Fee': formatMetadataGasFee(),
    '@type': txType || 'N/A',
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
