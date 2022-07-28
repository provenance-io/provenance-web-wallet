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
import { useActiveAccount, useWalletConnect } from 'redux/hooks';
import { List, Authenticate, Content, FullData, Sprite, Loading } from 'Components';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  txMessageFormat,
  getTxFeeEstimate,
  getGrpcApi,
  getChainId,
  convertHexToUtf8,
  hashFormat,
} from 'utils';
import { BIP32Interface, NotificationType } from 'types';
import { ICON_NAMES } from 'consts';
import { COLORS } from 'theme';

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
  align-items: center;
  width: 100%;
  left: 0;
  user-select: none;
  z-index: 200;
  svg {
    cursor: pointer;
    margin: 0 4px;
  }
`;

interface Props {
  payload: EventPayload;
  closeWindow: () => void;
  changeNotificationPage: (type: NotificationType, data: {}) => void;
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

export const TransactionRequest: React.FC<Props> = ({
  payload,
  closeWindow,
  changeNotificationPage,
}) => {
  const {
    connector,
    connectionEXP,
    connectionDuration,
    saveWalletconnectData,
    removePendingRequest,
  } = useWalletConnect();
  const { address: activeAccountAddress, publicKey: activeAccountPublicKey } =
    useActiveAccount();
  const [parsedMetadata, setParsedMetadata] = useState<ParsedMetadata>({});
  const [txMsgAny, setTxMsgAny] = useState<any[]>([]);
  const [txFeeEstimate, setTxFeeEstimate] = useState<number>(0);
  const [txGasEstimate, setTxGasEstimate] = useState<number>(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // New states
  const [msgPage, setMsgPage] = useState(0);
  const [parsedTxMessages, setParsedTxMessages] = useState<ParsedTxMessage[]>([]);
  const [unpackedTxMessageAnys, setUnpackedTxMessageAnys] = useState<any[]>([]);

  // Onload, pull out and parse payload params
  useEffect(() => {
    if (initialLoad) {
      // Only run this once
      setInitialLoad(false);
      const { params } = payload; // payload = { ..., params: [metadata, hexMessage1, hexMessage2, hexMessageN] }
      const [metadataString, ...hexEncodedMessages] = params as string[];
      // Gather all messageAnys together
      const msgAnyArray: any[] = [];
      // Gather all parsedTxMessages
      const unpackedTxMessageArray: any[] = [];
      // Gather all unpackedTxMaggeAnys
      const parsedTxMessageArray: ParsedTxMessage[] = [];
      // First parse out and save the metadata
      const newParsedMetadata = JSON.parse(metadataString);
      setParsedMetadata(newParsedMetadata);
      // Loop through each hexEncodedMessage and build it out
      hexEncodedMessages.forEach((hexEncodedMessage) => {
        // Messages are sent from wc-js as hex.  Convert to utf-8 (b64)
        const messageAnyB64 = convertHexToUtf8(hexEncodedMessage);
        // Convert the b64 message into a full/real messageAny
        const msgAny = msgAnyB64toAny(messageAnyB64);
        // Add to the txMsgAny array (Paginated list of messages)
        msgAnyArray.push(msgAny);
        // Convert the b64 message any into a readable object then add/save to store
        const unpackedMsgAny = unpackDisplayObjectFromWalletMessage(messageAnyB64);
        unpackedTxMessageArray.push(unpackedMsgAny);
        // Use util to convert special fields and update how values are displayed
        const formattedTxMsg = txMessageFormat(unpackedMsgAny);
        // Add the txType to the formattedTxMsg
        formattedTxMsg['@type'] = msgAny.getTypeName();
        // Add this formatted message to the parsed tx message arrays
        parsedTxMessageArray.push(formattedTxMsg);
      });
      // Calculate the tx and gas fees (must be async)
      (async () => {
        // Main address comes from metadata
        const metadataAddress = newParsedMetadata.address!;
        // Make sure this address is the same as the active account in the wallet
        if (metadataAddress === activeAccountAddress) {
          try {
            const {
              txFeeEstimate: newTxFeeEstimate,
              txGasEstimate: newTxGasEstimate,
            } = await getTxFeeEstimate({
              address: metadataAddress,
              publicKey: activeAccountPublicKey!,
              msgAny: msgAnyArray,
              gasPrice: newParsedMetadata?.gasPrice?.gasPrice,
              gasPriceDenom: newParsedMetadata?.gasPrice?.gasPriceDenom,
            });
            // Save the returned fee/gas estimates
            setTxFeeEstimate(newTxFeeEstimate);
            setTxGasEstimate(newTxGasEstimate);
          } catch (err) {
            changeNotificationPage('failed', {
              failedMessage: `${err}`,
              title: 'Transaction Failed',
            });
          }
        }
      })();
      // Save values in store to display in UI
      setTxMsgAny(msgAnyArray);
      setUnpackedTxMessageAnys(unpackedTxMessageArray);
      setParsedTxMessages(parsedTxMessageArray);
    }
  }, [
    payload,
    txMsgAny,
    initialLoad,
    changeNotificationPage,
    activeAccountAddress,
    activeAccountPublicKey,
    parsedTxMessages,
    unpackedTxMessageAnys,
  ]);

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

  const formatMetadataGasFee = () => {
    const gasPriceDenom = parsedMetadata?.gasPrice?.gasPriceDenom || 'nhash';
    return gasPriceDenom === 'nhash'
      ? `${(
          hashFormat(txFeeEstimate, 'nhash') + hashFormat(txGasEstimate!, 'nhash')
        ).toFixed(4)} Hash`
      : `${(txFeeEstimate + txGasEstimate).toFixed(3)} ${gasPriceDenom}`;
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
        feeDenom: parsedMetadata?.gasPrice?.gasPriceDenom || 'nhash',
        feeEstimate: txFeeEstimate,
        gasEstimate: txGasEstimate,
        memo: parsedMetadata.memo || '',
        msgAny: txMsgAny,
        wallet,
      });
      setIsLoading(true);
      const result = await broadcastTx(grpcAddress, broadcastTxRequest);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      });
      await removePendingRequest(payload.id);
      await bumpWalletConnectTimeout();
      setIsLoading(false);
      changeNotificationPage('complete', {
        result: {
          ...result.txResponse,
          ...parsedMetadata,
          date: parsedMetadata?.date
            ? format(new Date(parsedMetadata.date), 'MMM d, h:mm a')
            : 'N/A',
          gasFee: formatMetadataGasFee(),
        },
      });
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

  const renderMessagePage = () => {
    // Look over the metadata and build an object display that information
    const metadataListItems = {
      platform: connector?.peerMeta?.name || 'N/A',
      'Gas Fee': formatMetadataGasFee(),
      date: parsedMetadata?.date
        ? format(new Date(parsedMetadata.date), 'MMM d, h:mm a')
        : 'N/A',
      description: parsedMetadata?.description || 'N/A',
    };
    // Based on the current tx page, get the parsedTxMessages to display
    const txMsgListItems = { ...parsedTxMessages[msgPage] };
    // One field is incorrectly labled accessListList in the protos, we also want to render it last
    const { accessListList, ...filteredTxMsgListItems } = txMsgListItems;
    return {
      ...metadataListItems,
      ...filteredTxMsgListItems,
      ...(accessListList !== undefined && { accessList: accessListList }),
    };
  };

  const maxPages = parsedTxMessages.length;

  const changeMsgPage = (action: number) => {
    const newPage = msgPage + action;
    // Don't let the page go above total pages or below 1
    if (newPage >= 0 && newPage < maxPages) setMsgPage(newPage);
  };

  return (
    <Content>
      <Title>Transaction</Title>
      <FullData data={unpackedTxMessageAnys[msgPage]} />
      <List message={renderMessagePage()} maxHeight="324px" />
      <PaginationDisplay>
        {maxPages > 1 && (
          <Sprite
            icon={ICON_NAMES.CARET}
            onClick={() => changeMsgPage(-1)}
            size="1.0rem"
            spin={90}
            color={msgPage === 0 ? COLORS.NEUTRAL_350 : COLORS.WHITE}
          />
        )}
        {msgPage + 1}/{maxPages}
        {maxPages > 1 && (
          <Sprite
            icon={ICON_NAMES.CARET}
            onClick={() => changeMsgPage(1)}
            size="1.0rem"
            spin={-90}
            color={msgPage === maxPages ? COLORS.NEUTRAL_350 : COLORS.WHITE}
          />
        )}
      </PaginationDisplay>
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        approveText="Sign Message"
      />
      {isLoading && <Loading fullscreen />}
    </Content>
  );
};
