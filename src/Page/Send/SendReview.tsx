import { useNavigate } from 'react-router';
import { Authenticate, Content, Header } from 'Components';
import { ICON_NAMES, SEND_AMOUNT_URL, SEND_COMPLETE_URL, CHAINID_MAINNET, CHAINID_TESTNET } from 'consts';
import { useMessage, useActiveAccount } from 'redux/hooks';
import { getGrpcApi } from 'utils';
import { convertUtf8ToBuffer } from '@walletconnect/utils';
import { Message } from 'google-protobuf';
import {
  buildCalculateTxFeeRequest,
  buildBroadcastTxRequest,
  buildMessage,
  createAnyMessageBase64,
  getAccountInfo,
  msgAnyB64toAny,
  broadcastTx,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';
import { BIP32Interface } from 'types';

export const SendReview = () => {
  const navigate = useNavigate();
  const { address, publicKey, network } = useActiveAccount();
  const { coin, coinAmount, coinAddress } = useMessage();

  const handleSignAndSend = (masterKey: BIP32Interface) => {
    if (address && coinAddress && coin?.denom) {
      (async () => {
        const grpcAddress = getGrpcApi(address);
        const type = 'MsgSend';
        const gasPrice = 19050;
        const gasAdjustment = 1.25;
        const gasPriceDenom = 'nhash';
        const feeDenom = 'nhash';
        const memo = `Send Coin (${coin.denom}) to ${coinAddress}`;
        const chainId = network === 'testnet' ? CHAINID_TESTNET : CHAINID_MAINNET;
        const wallet = { address, privateKey: masterKey.privateKey, publicKey: masterKey.publicKey };
        const sendMessage = {
          amountList: [{ denom: coin.denom, amount: coinAmount!}],
          fromAddress: address,
          toAddress: coinAddress,
        };
        const messageMsgSend = buildMessage(type, sendMessage);
        const messageB64String = createAnyMessageBase64(type, messageMsgSend as Message);
        const msgAny = msgAnyB64toAny(messageB64String);
        const { baseAccount } = await getAccountInfo(address, grpcAddress);
        const calculateTxFeeRequest = buildCalculateTxFeeRequest({
          msgAny,
          account: baseAccount,
          publicKey: convertUtf8ToBuffer(publicKey!), 
          gasPriceDenom,
          gasPrice,
          gasAdjustment,
        });
        // const broadcastTxRequest = buildBroadcastTxRequest({
        //   account: baseAccount,
        //   chainId,
        //   feeDenom,
        //   // feeEstimate: calculateTxFeeRequest,
        //   // gasEstimate: calculateTxFeeRequest,
        //   memo,
        //   msgAny,
        //   wallet,
        // });

        // await broadcastTx(grpcAddress, broadcastTxRequest);
        // console.log('grpcAddress :', grpcAddress);
        // console.log('sendMessage :', sendMessage);
        // console.log('request :', request);
        // console.log('msgAny :', msgAny);
        // console.log('baseAccount :', baseAccount);
        // console.log('calculateTxFeeRequest :', calculateTxFeeRequest);
        navigate(SEND_COMPLETE_URL);
      })();
    }
  };

  return !coin ? null : (
    <Content>
      <Header title="Send Review" iconLeft={ICON_NAMES.ARROW} />
      <h2>Confirm your information</h2>
      <p>Please review the details below to make sure everything is correct.</p>
      <Authenticate
        handleApprove={(masterKey) => handleSignAndSend(masterKey)}
        handleDecline={() => navigate(SEND_AMOUNT_URL)}
        approveText="Sign &amp; Send"
        rejectText="Back"
      />
    </Content>
  );
};
