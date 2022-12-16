import type {
  EventPayload,
  ExtensionTypes,
  BIP32Interface,
  NotificationType,
  IClientMeta,
} from 'types';
import styled from 'styled-components';
import {
  unpackDisplayObjectFromWalletMessage,
  buildBroadcastTxRequest,
  broadcastTx,
  getAccountInfo,
  msgAnyB64toAny,
  CoinAsObject,
} from '@provenanceio/wallet-utils';
import { useActiveAccount, useSettings, useWalletConnect } from 'redux/hooks';
import {
  List,
  Authenticate,
  Content,
  FullData,
  Sprite,
  Loading,
  GasAdjustment,
  Typo,
  Header,
} from 'Components';
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
import { ICON_NAMES, DEFAULT_GAS_ADJUSTMENT } from 'consts';
import { COLORS } from 'theme';

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
  extensionType: ExtensionTypes;
}
interface ParsedTxMessage {
  [fieldName: string]: any;
}

export const TransactionRequest: React.FC<Props> = ({
  payload,
  closeWindow,
  changeNotificationPage,
  extensionType,
}) => {
  const { connector, removePendingRequest, bumpWCDuration } = useWalletConnect();
  const { customGRPCApi } = useSettings();
  const { address: activeAccountAddress, publicKey: activeAccountPublicKey } =
    useActiveAccount();
  const [parsedMetadata, setParsedMetadata] = useState<IClientMeta>();
  const [txMsgAny, setTxMsgAny] = useState<any[]>([]);
  const [txFeeEstimate, setTxFeeEstimate] = useState<CoinAsObject[]>([]);
  const [txGasEstimate, setTxGasEstimate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [runFeeCalc, setRunFeeCalc] = useState(true);
  const [gasFeeCalcLoading, setGasFeeCalcLoading] = useState(false);
  const [gasAdjustment, setGasAdjustment] = useState(DEFAULT_GAS_ADJUSTMENT);
  // New states
  const [msgPage, setMsgPage] = useState(0);
  const [parsedTxMessages, setParsedTxMessages] = useState<ParsedTxMessage[]>([]);
  const [unpackedTxMessageAnys, setUnpackedTxMessageAnys] = useState<any[]>([]);

  // Onload, pull out and parse payload params
  useEffect(() => {
    if (runFeeCalc) {
      // Only run this when needed
      setRunFeeCalc(false);
      const { params } = payload; // payload = { ..., params: [metadata, hexMessage1, hexMessage2, hexMessageN] }
      // If we are disconnected, the params are changed into an object with a message stating "Session disconnected"
      // Normally, the message comes through and the value is a string, when it isn't do nothing
      if (typeof params[0] === 'string') {
        const [metadataString, ...hexEncodedMessages] = params;
        // Gather all messageAnys together
        const msgAnyArray: any[] = [];
        // Gather all parsedTxMessages
        const unpackedTxMessageArray: any[] = [];
        // Gather all unpackedTxMaggeAnys
        const parsedTxMessageArray: ParsedTxMessage[] = [];
        // First parse out and save the metadata
        const newParsedMetadata: IClientMeta = JSON.parse(metadataString);
        setParsedMetadata(newParsedMetadata);
        // Loop through each hexEncodedMessage and build it out
        hexEncodedMessages.forEach((hexEncodedMessage) => {
          try {
            // Messages are sent from wc-js as hex.  Convert to utf-8 (b64)
            const messageAnyB64 = convertHexToUtf8(hexEncodedMessage);
            // Convert the b64 message into a full/real messageAny
            const msgAny = msgAnyB64toAny(messageAnyB64);
            // Add to the txMsgAny array (Paginated list of messages)
            msgAnyArray.push(msgAny);
            // Convert the b64 message any into a readable object then add/save to store
            const unpackedMsgAny =
              unpackDisplayObjectFromWalletMessage(messageAnyB64);
            unpackedTxMessageArray.push(unpackedMsgAny);
            // Use util to convert special fields and update how values are displayed
            const formattedTxMsg = txMessageFormat(unpackedMsgAny);
            // Add the txType to the formattedTxMsg
            formattedTxMsg['@type'] = msgAny.getTypeName();
            // Add this formatted message to the parsed tx message arrays
            parsedTxMessageArray.push(formattedTxMsg);
          } catch (err) {
            changeNotificationPage('failed', {
              failedMessage: `${err}`,
              title: 'Transaction Failed',
            });
          }
        });
        // Calculate the tx and gas fees (must be async)
        (async () => {
          // Main address comes from metadata
          const metadataAddress = newParsedMetadata.address!;
          // Make sure this address is the same as the active account in the wallet
          if (metadataAddress === activeAccountAddress) {
            setGasFeeCalcLoading(true);
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
                gasAdjustment: Number(gasAdjustment),
                customGRPCApi,
                feePayer: newParsedMetadata?.feePayer,
                feeGranter: newParsedMetadata?.feeGranter,
              });
              // Save the returned fee/gas estimates
              setTxFeeEstimate(newTxFeeEstimate);
              setTxGasEstimate(newTxGasEstimate);
              setGasFeeCalcLoading(false);
            } catch (err) {
              changeNotificationPage('failed', {
                failedMessage: `${err}`,
                title: 'Transaction Failed',
              });
              setGasFeeCalcLoading(false);
            }
          }
        })();
        // Save values in store to display in UI
        setTxMsgAny(msgAnyArray);
        setUnpackedTxMessageAnys(unpackedTxMessageArray);
        setParsedTxMessages(parsedTxMessageArray);
      }
    }
  }, [
    payload,
    txMsgAny,
    runFeeCalc,
    gasAdjustment,
    changeNotificationPage,
    activeAccountAddress,
    activeAccountPublicKey,
    parsedTxMessages,
    unpackedTxMessageAnys,
    customGRPCApi,
  ]);

  const changeGasAdjustmentFee = (value: string) => {
    setGasAdjustment(value);
    setRunFeeCalc(true);
  };

  const formatMetadataGasFee = () => {
    // Pull out all nhash fees into an array
    const nhashFeesArray = txFeeEstimate.filter((i) => i.denom === 'nhash');
    const nhashFeeTotal = nhashFeesArray.reduce(
      (total, { amount: nhashAmount }) => total + Number(nhashAmount),
      txGasEstimate
    );
    return `${hashFormat(nhashFeeTotal, 'nhash').toFixed(3)} Hash`;
  };

  const handleApprove = async (masterKey: BIP32Interface) => {
    // Connector must exist to respond to request
    if (connector) {
      const address = parsedMetadata!.address;
      const feePayer = parsedMetadata?.feePayer;
      const feeGranter = parsedMetadata?.feeGranter;
      const privateKey = masterKey.privateKey!;
      const publicKey = masterKey.publicKey;
      const wallet = { address, privateKey, publicKey };
      const grpcAddress = customGRPCApi || getGrpcApi(address);
      const chainId = getChainId(address);
      const { baseAccount } = await getAccountInfo(address, grpcAddress);
      const broadcastTxRequest = buildBroadcastTxRequest({
        account: baseAccount,
        chainId,
        feeDenom: parsedMetadata?.gasPrice?.gasPriceDenom || 'nhash',
        feeEstimate: txFeeEstimate,
        gasLimit: txGasEstimate,
        memo: parsedMetadata!.memo || '',
        msgAny: txMsgAny,
        wallet,
        feePayer,
        feeGranter,
      });
      setIsLoading(true);
      const result = await broadcastTx(grpcAddress, broadcastTxRequest);
      await connector.approveRequest({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result,
      });
      await removePendingRequest(payload.id);
      await bumpWCDuration();
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
      await bumpWCDuration();
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
      ...(parsedMetadata?.feeGranter && { feeGranter: parsedMetadata.feeGranter }),
      ...(parsedMetadata?.feePayer && { feePayer: parsedMetadata.feePayer }),
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
      {extensionType === 'extension' && <Header />}
      <Typo marginBottom="20px" type="headline2">
        Transaction
      </Typo>
      <FullData data={unpackedTxMessageAnys[msgPage]} />
      <GasAdjustment value={gasAdjustment} onChange={changeGasAdjustmentFee} />
      <List
        message={renderMessagePage()}
        maxHeight={extensionType === 'extension' ? '230px' : '274px'}
      />
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
        disabled={gasFeeCalcLoading}
      />
      {isLoading && <Loading fullscreen />}
    </Content>
  );
};
