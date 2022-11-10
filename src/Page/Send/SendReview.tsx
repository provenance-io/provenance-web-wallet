import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Authenticate, Content, Header, List, Loading, Typo } from 'Components';
import { ICON_NAMES, SEND_AMOUNT_URL, SEND_COMPLETE_URL } from 'consts';
import { useMessage, useSettings } from 'redux/hooks';
import { getChainId, getGrpcApi, hashFormat, trimAddress, capitalize } from 'utils';
import {
  buildBroadcastTxRequest,
  getAccountInfo,
  broadcastTx,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';
import type { BIP32Interface } from 'types';

export const SendReview = () => {
  const navigate = useNavigate();
  const { customGRPCApi } = useSettings();
  const {
    coin,
    displayAmount,
    txMemo,
    txFromAddress,
    txSendAddress,
    txFeeEstimate,
    txFeeEstimateCoins,
    txFeeDenom,
    txGasEstimate,
    setTxDate,
    txMsgAny,
    setTxResponse,
  } = useMessage();
  const [baseAccount, setBaseAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const grpcAddress = customGRPCApi || getGrpcApi(txFromAddress!);

  // Get baseAccount
  useEffect(() => {
    const getBaseAccount = async () => {
      const { baseAccount } = await getAccountInfo(txFromAddress!, grpcAddress);
      setBaseAccount(baseAccount);
    };
    getBaseAccount();
  }, [grpcAddress, txFromAddress]);

  const handleSignAndSend = (masterKey: BIP32Interface) => {
    if (txFromAddress && txSendAddress && coin?.denom) {
      (async () => {
        const wallet = {
          address: txFromAddress,
          privateKey: masterKey.privateKey!,
          publicKey: masterKey.publicKey,
        };
        const chainId = getChainId(txFromAddress);
        const broadcastTxRequest = buildBroadcastTxRequest({
          account: baseAccount,
          chainId,
          feeDenom: txFeeDenom,
          feeEstimate: txFeeEstimateCoins!,
          gasLimit: txGasEstimate!,
          memo: txMemo || '',
          msgAny: txMsgAny,
          wallet,
        });
        const txDate = Date.now();
        setTxDate(txDate);
        setIsLoading(true);
        const response = await broadcastTx(grpcAddress, broadcastTxRequest);
        setTxResponse(response.txResponse);
        setIsLoading(false);
        navigate(SEND_COMPLETE_URL);
      })();
    }
  };

  // Convert total fees (nhash) into hash
  const totalFees = hashFormat(
    (txFeeEstimate || 0) + (txGasEstimate || 0),
    'nhash'
  ).toFixed(2);

  // Total depends on if we're sending hash or not
  // Sending hash => combine fees with send hash for total (eg: Total: 12.3 Hash)
  // Sending xCoin => combine fees as string with send for total (eg: Total 10 xCoin + 2.3 Hash)
  const getTotal = () => {
    if (!coin) return 'N/A';
    const sendingHash = coin.denom === 'nhash';
    // Sending hash
    if (sendingHash)
      return `${Number(displayAmount) + Number(totalFees)} ${capitalize(
        coin.display,
        'uppercase'
      )}`; // 12.3 hash
    // Sending non-hash
    return `${displayAmount} ${capitalize(
      coin.display,
      'uppercase'
    )} + ${totalFees} hash`;
  };

  return !coin ? null : (
    <Content>
      <Header title="Send Review" iconLeft={ICON_NAMES.ARROW} />
      <Typo type="title" align="left">
        Confirm your information
      </Typo>
      <Typo type="body" align="left" marginBottom="50px">
        Please review the details below to make sure everything is correct.
      </Typo>
      <List
        message={{
          to: trimAddress(txSendAddress) || 'N/A',
          from: trimAddress(txFromAddress) || 'N/A',
          sending: `${displayAmount} ${capitalize(coin.display, 'uppercase')}`,
          'Transaction Fee': `${totalFees} Hash`,
          ...(!!txMemo && { note: txMemo }),
          total: getTotal(),
        }}
        marginBottom="80px"
        maxHeight="180px"
      />
      <Authenticate
        handleApprove={(masterKey) => handleSignAndSend(masterKey)}
        handleDecline={() => navigate(SEND_AMOUNT_URL)}
        approveText="Sign &amp; Send"
        rejectText="Back"
      />
      {isLoading && <Loading fullscreen />}
    </Content>
  );
};
