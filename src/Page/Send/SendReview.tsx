import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Authenticate, Content, Header, List, Typo } from 'Components';
import { ICON_NAMES, SEND_AMOUNT_URL, SEND_COMPLETE_URL, CHAINID_MAINNET, CHAINID_TESTNET } from 'consts';
import { useMessage, useActiveAccount } from 'redux/hooks';
import { getGrpcApi, hashFormat } from 'utils';
import { Message } from 'google-protobuf';
import {
  buildBroadcastTxRequest,
  buildMessage,
  createAnyMessageBase64,
  getAccountInfo,
  msgAnyB64toAny,
  broadcastTx,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';
import { BIP32Interface } from 'types';

// TODO: Needs to get tx fee Denom (currently hardcoded).  When ability to send other coins exists

export const SendReview = () => {
  const navigate = useNavigate();
  const { address, network } = useActiveAccount();
  const {
    coin,
    coinAmount,
    txMemo,
    txFromAddress,
    txSendAddress,
    txFeeEstimate,
    txGasEstimate,
    setTxDate,
  } = useMessage();
  const [baseAccount, setBaseAccount] = useState<any>(null);
  const type = 'MsgSend';
  const feeDenom = 'nhash';
  const memo = txMemo || '';
  const chainId = network === 'testnet' ? CHAINID_TESTNET : CHAINID_MAINNET;
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
        const sendMessage = {
          amountList: [{ denom: coin!.denom, amount: coinAmount!}],
          fromAddress: address!,
          toAddress: txSendAddress!,
        };
        const messageMsgSend = buildMessage(type, sendMessage);
        const messageB64String = createAnyMessageBase64(type, messageMsgSend as Message);
        const msgAny = msgAnyB64toAny(messageB64String);
        const wallet = { address: txFromAddress!, privateKey: masterKey.privateKey!, publicKey: masterKey.publicKey };
        const broadcastTxRequest = buildBroadcastTxRequest({
          account: baseAccount,
          chainId,
          feeDenom,
          feeEstimate: txFeeEstimate!,
          gasEstimate: txGasEstimate!,
          memo,
          msgAny,
          wallet,
        });
        const txDate = Date.now();
        setTxDate(txDate);

        await broadcastTx(grpcAddress, broadcastTxRequest);
        navigate(SEND_COMPLETE_URL);
      })();
    }
  };

  const transactionFeeHash = (txFeeEstimate) ? `${hashFormat(txFeeEstimate, 'nhash').toFixed(2)}` : 0;
  const gasFeeHash = (txGasEstimate) ? `${hashFormat(txGasEstimate, 'nhash').toFixed(2)}` : 0;
  const totalFees = Number(transactionFeeHash) + Number(gasFeeHash);
  const total = `${txFeeEstimate ? Number(coinAmount) + totalFees : coinAmount}`;

  return !coin ? null : (
    <Content>
      <Header title="Send Review" iconLeft={ICON_NAMES.ARROW} />
      <Typo type="title" align="left">Confirm your information</Typo>
      <Typo type="body" align="left" marginBottom="50px">Please review the details below to make sure everything is correct.</Typo>
      <List
        message={{
          to: txSendAddress || 'N/A',
          from: txFromAddress || 'N/A',
          sending: `${coinAmount} ${coin.display}`,
          'Transaction Fee': `${totalFees} ${coin.display}`,
          ...(!!memo && {note: memo}),
          total: `${total} ${coin.display}`
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
    </Content>
  );
};
