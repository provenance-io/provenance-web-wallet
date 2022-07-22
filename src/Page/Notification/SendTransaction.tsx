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
import { List, Authenticate, Content, FullData } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  txMessageFormat,
  getTxFeeEstimate,
  getGrpcApi,
  getChainId,
  convertHexToUtf8,
  hashFormat,
  validateAddress,
} from 'utils';
import { BIP32Interface } from 'types';

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

interface Props {
  payload: EventPayload;
  closeWindow: () => void;
  setFailedMessage: (value: string) => void;
}
interface ParsedMetadata {
  address?: string;
  description?: string;
  messageAnyB64?: string;
  date?: number;
  memo?: string;
  gasPrice?: {
    gasPrice: number;
    gasPriceDenom: SupportedDenoms;
  };
  type?: string;
}
interface ParsedTxMessage {
  [fieldName: string]: any;
}

export const SendTransaction: React.FC<Props> = ({
  payload,
  closeWindow,
  setFailedMessage,
}) => {
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
  const [unpackedTxMsgAny, setUnpackedTxMsgAny] = useState({});
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
      let msgObj;
      if (messageAnyB64) {
        msgObj = unpackDisplayObjectFromWalletMessage(messageAnyB64);
        setUnpackedTxMsgAny(msgObj);
        txMsg = txMessageFormat(msgObj);
      }

      setParsedMetadata(newParsedMetadata);
      setParsedTxMessage(txMsg as ParsedTxMessage);
      // Calculate the tx and gas fees
      (async () => {
        const {
          toAddress,
          fromAddress,
          delegatorAddress,
          validatorAddress,
          address: txMsgAddress,
        } = (msgObj as { [key: string]: any }) || {};
        const metadataAddress = newParsedMetadata.address!;
        const potentialAddresses = [
          metadataAddress,
          toAddress,
          fromAddress,
          delegatorAddress,
          validatorAddress,
          txMsgAddress,
        ];
        // Build a list of all possible address values and validate all of them.  Must all be valid to calculate txFees w/o errors
        const addressesToValidate = potentialAddresses.filter(
          (address) => !!address
        );
        const allAddressValid = !addressesToValidate.filter(
          (address: string) => !validateAddress(address)
        ).length;
        const targetAccount = accounts.find(
          ({ address: storeAddress }) => storeAddress === metadataAddress
        );
        if (targetAccount && allAddressValid) {
          const { txFeeEstimate, txGasEstimate } = await getTxFeeEstimate({
            address: metadataAddress,
            publicKey: targetAccount.publicKey!,
            msgAny,
            gasPrice: newParsedMetadata?.gasPrice?.gasPrice,
            gasPriceDenom: newParsedMetadata?.gasPrice?.gasPriceDenom,
          });
          setTxFeeEstimate(txFeeEstimate);
          setTxGasEstimate(txGasEstimate);
        } else {
          // Missing or invalid address for tx, display a message to the user and stop the transaction
          setFailedMessage(
            'Missing or invalid address received, please review all addresses in the transaction request and try again.'
          );
        }
      })();
    }
  }, [payload, parsedMetadata, txMsgAny, accounts, initialLoad, setFailedMessage]);

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

  const formatMetadataGasFee = () => {
    const gasPriceDenom = parsedMetadata?.gasPrice?.gasPriceDenom || 'nhash';
    return gasPriceDenom === 'nhash'
      ? `${(
          hashFormat(txFeeEstimate, 'nhash') + hashFormat(txGasEstimate!, 'nhash')
        ).toFixed(4)} Hash`
      : `${(txFeeEstimate + txGasEstimate).toFixed(3)} ${gasPriceDenom}`;
  };
  const metadataListItems = {
    platform: connector?.peerMeta?.name || 'N/A',
    'Gas Fee': formatMetadataGasFee(),
    '@type': txType || 'N/A',
    date: parsedMetadata?.date
      ? format(new Date(parsedMetadata.date), 'MMM d, h:mm a')
      : 'N/A',
    description: parsedMetadata?.description || 'N/A',
  };
  const txMsgListItems = { ...parsedTxMessage };
  // One field is incorrectly labled accessListList in the protos, we also want to render it last
  const { accessListList, ...filteredTxMsgListItems } = txMsgListItems;
  const ListItems = {
    ...metadataListItems,
    ...filteredTxMsgListItems,
    ...(accessListList !== undefined && { accessList: accessListList }),
  };

  return (
    <Content>
      <Title>Transaction</Title>
      <FullData data={unpackedTxMsgAny} />
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
