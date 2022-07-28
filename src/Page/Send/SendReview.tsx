import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Authenticate, Content, Header, List, Loading, Typo } from 'Components';
import { ICON_NAMES, SEND_AMOUNT_URL, SEND_COMPLETE_URL } from 'consts';
import { useMessage } from 'redux/hooks';
import { getChainId, getGrpcApi, hashFormat, trimAddress } from 'utils';
import {
  buildBroadcastTxRequest,
  getAccountInfo,
  broadcastTx,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';
import { BIP32Interface } from 'types';

// TODO: Needs to get tx fee Denom (currently hardcoded).  When ability to send other coins exists

export const SendReview = () => {
  const navigate = useNavigate();
  const {
    coin,
    coinAmount,
    txMemo,
    txFromAddress,
    txSendAddress,
    txFeeEstimate,
    txFeeDenom,
    txGasEstimate,
    setTxDate,
    txMsgAny,
    setTxResponse,
  } = useMessage();
  const [baseAccount, setBaseAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const grpcAddress = getGrpcApi(txFromAddress!);

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
          feeEstimate: txFeeEstimate!,
          gasEstimate: txGasEstimate!,
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

  const transactionFeeHash = txFeeEstimate
    ? `${hashFormat(txFeeEstimate, 'nhash').toFixed(2)}`
    : 0;
  const gasFeeHash = txGasEstimate
    ? `${hashFormat(txGasEstimate, 'nhash').toFixed(2)}`
    : 0;
  const totalFees = Number(transactionFeeHash) + Number(gasFeeHash);
  const total = `${txFeeEstimate ? Number(coinAmount) + totalFees : coinAmount}`;

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
          sending: `${coinAmount} ${coin.display}`,
          'Transaction Fee': `${totalFees} ${coin.display}`,
          ...(!!txMemo && { note: txMemo }),
          total: `${total} ${coin.display}`,
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
