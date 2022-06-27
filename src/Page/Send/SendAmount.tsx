import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Header, Input, Sprite } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL, GRPC_CLIENT_ADDRESS_MAINNET } from 'consts';
import { useActiveAccount, useMessage } from 'redux/hooks';
import { capitalize } from 'utils';
import { COLORS, COLOR_VARIABLES } from 'theme';
import {
  MsgSendDisplay,
  ReadableMessageNames,
  TYPE_NAMES_READABLE_MAP,
  MsgExecuteContractParams,
  MsgGrantDisplay,
  MsgVerifyInvariantDisplay,
  MsgSetWithdrawAddressDisplay,
  MsgWithdrawDelegatorRewardDisplay,
  MsgWithdrawValidatorCommissionDisplay,
  MsgFundCommunityPoolDisplay,
  MsgSubmitEvidenceDisplay,
  MsgSubmitProposalDisplay,
  MsgVoteDisplay,
  MsgVoteWeightedDisplay,
  MsgDepositDisplay,
  MsgUnjailDisplay,
  MsgCreateValidatorDisplay,
  MsgEditValidatorDisplay,
  MsgDelegateDisplay,
  MsgBeginRedelegateDisplay,
  MsgUndelegateDisplay,
  MsgCreateVestingAccountDisplay,
  SupportedDenoms,
} from 'types';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import { Message } from 'google-protobuf';
import { MsgDelegate } from 'proto/cosmos/staking/v1beta1/tx_pb';
import { Coin } from 'proto/cosmos/base/v1beta1/coin_pb';
import { MsgSend } from 'proto/cosmos/bank/v1beta1/tx_pb';
import { BaseAccount } from 'proto/cosmos/auth/v1beta1/auth_pb';
import type { Bytes } from '@tendermint/types';
import { CalculateTxFeesRequest } from 'proto/provenance/msgfees/v1/query_pb';
import { PubKey } from 'proto/cosmos/crypto/secp256k1/keys_pb';
import { QueryClient as AuthQueryClient } from 'proto/cosmos/auth/v1beta1/query_grpc_web_pb';
import { SignMode } from 'proto/cosmos/tx/signing/v1beta1/signing_pb';
import { base64ToBytes, bytesToBase64 } from '@tendermint/belt';
import {
  QueryAccountRequest,
  // QueryAccountResponse,
} from 'proto/cosmos/auth/v1beta1/query_pb';
import {
  AuthInfo,
  Fee,
  ModeInfo,
  SignerInfo,
  TxBody,
  TxRaw,
} from 'proto/cosmos/tx/v1beta1/tx_pb';

const createAnyMessageBase64 = (
  type: ReadableMessageNames,
  msg: Message
): string => {
  const msgAny = new google_protobuf_any_pb.Any();
  msgAny.pack(msg.serializeBinary(), TYPE_NAMES_READABLE_MAP[type], '/');
  return bytesToBase64(msgAny.serializeBinary());
};

export const buildMessage = (
  type: ReadableMessageNames,
  params:
    | MsgSendDisplay
    | MsgExecuteContractParams
    | MsgGrantDisplay
    | MsgVerifyInvariantDisplay
    | MsgSetWithdrawAddressDisplay
    | MsgWithdrawDelegatorRewardDisplay
    | MsgWithdrawValidatorCommissionDisplay
    | MsgFundCommunityPoolDisplay
    | MsgSubmitEvidenceDisplay
    | MsgSubmitProposalDisplay
    | MsgVoteDisplay
    | MsgVoteWeightedDisplay
    | MsgDepositDisplay
    | MsgUnjailDisplay
    | MsgCreateValidatorDisplay
    | MsgEditValidatorDisplay
    | MsgDelegateDisplay
    | MsgBeginRedelegateDisplay
    | MsgUndelegateDisplay
    | MsgCreateVestingAccountDisplay
) => {
  switch (type) {
    case 'MsgDelegate': {
      const { delegatorAddress, validatorAddress, amount } =
        params as MsgDelegateDisplay;
      const msgDelegate = new MsgDelegate()
        .setDelegatorAddress(delegatorAddress)
        .setValidatorAddress(validatorAddress);
      if (amount) {
        console.log('amount: ', amount)
        msgDelegate.setAmount(
          new Coin().setAmount(`${amount.amount}`).setDenom(amount.denom)
        );
      }
      return msgDelegate;
    }

    case 'MsgSend': {
      const { fromAddress, toAddress, amountList } = params as MsgSendDisplay;
      // log(`Building MsgSend: ${fromAddress} to ${toAddress}`);
      const msgSend = new MsgSend()
        .setFromAddress(fromAddress)
        .setToAddress(toAddress);
      console.log('amountList: ', amountList)
      amountList.forEach(({ denom, amount }) => {
        msgSend.addAmount(new Coin().setAmount(`${amount}`).setDenom(denom));
      });
      return msgSend;
    }
  }
};

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
`;

const AssetImg = styled.object`
  width: 100px;
  max-width: 113px;
`;

const AssetAmount = styled(Input)`
  margin: 12px 0 16px;
  border: none;
  color: #fff;
  font-size: 4.4rem;
  font-family: 'Montserrat';
  text-align: center;
`;

const TxMemo = styled(Input)`
  padding: 16px 8px;
  border: none;
  border-bottom: 1px solid ${COLOR_VARIABLES.NEUTRAL_700};
`;

export const SendAmount = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { coin, coinAddress, coinAmount, setCoinAmount, txMemo, setMemo } =
    useMessage();
  const { address, publicKey } = useActiveAccount();

  const buildTxBody = (
    msgAny: google_protobuf_any_pb.Any | google_protobuf_any_pb.Any[],
    memo: string = ''
  ): TxBody => {
    const txBody = new TxBody();
    if (Array.isArray(msgAny)) txBody.setMessagesList(msgAny);
    else txBody.addMessages(msgAny);
    txBody.setMemo(memo);
    return txBody;
  };

  const buildAuthInfo = (
    signerInfo: SignerInfo,
    feeDenom: SupportedDenoms,
    feeEstimate = 0,
    gasEstimate: number
  ): AuthInfo => {
    const feeCoin = new Coin();
    console.log('buildAuthInfo | feeDenom: ', feeDenom);
    feeCoin.setDenom(feeDenom);
    feeCoin.setAmount(feeEstimate.toString());
    const fee = new Fee();
    fee.setAmountList([feeCoin]);
    fee.setGasLimit(gasEstimate);
    const authInfo = new AuthInfo();
    authInfo.setFee(fee);
    authInfo.setSignerInfosList([signerInfo].filter((f) => f));
    return authInfo;
  };

  const buildSignerInfo = (
    baseAccount: BaseAccount,
    pubKeyBytes: Bytes
  ): SignerInfo => {
    const single = new ModeInfo.Single();
    single.setMode(SignMode.SIGN_MODE_DIRECT);
    const modeInfo = new ModeInfo();
    modeInfo.setSingle(single);
    const signerInfo = new SignerInfo();
    const pubKey = new PubKey();
    pubKey.setKey(pubKeyBytes);
    const pubKeyAny = new google_protobuf_any_pb.Any();
    pubKeyAny.pack(pubKey.serializeBinary(), TYPE_NAMES_READABLE_MAP.PubKey, '/');
    signerInfo.setPublicKey(pubKeyAny);
    signerInfo.setModeInfo(modeInfo);
    signerInfo.setSequence(baseAccount.getSequence());
    return signerInfo;
  };

  const buildCalculateTxFeeRequest = (
    msgAny: google_protobuf_any_pb.Any | google_protobuf_any_pb.Any[],
    account: BaseAccount,
    publicKey: Bytes,
    gasPriceDenom: SupportedDenoms = 'nhash',
    gasPrice: number,
    gasAdjustment = 1.25
  ): CalculateTxFeesRequest => {
    const signerInfo = buildSignerInfo(account, publicKey);
    const authInfo = buildAuthInfo(signerInfo, gasPriceDenom, undefined, gasPrice);
    const txBody = buildTxBody(msgAny);
    const txRaw = new TxRaw();
    txRaw.setBodyBytes(txBody.serializeBinary());
    txRaw.setAuthInfoBytes(authInfo.serializeBinary());
    txRaw.setSignaturesList([]);
  
    const calculateTxFeeRequest = new CalculateTxFeesRequest();
    calculateTxFeeRequest.setTxBytes(txRaw.serializeBinary());
    calculateTxFeeRequest.setDefaultBaseDenom(gasPriceDenom);
    calculateTxFeeRequest.setGasAdjustment(gasAdjustment);
    return calculateTxFeeRequest;
  };

  const msgAnyB64toAny = (msgAnyB64: string): google_protobuf_any_pb.Any => {
    return google_protobuf_any_pb.Any.deserializeBinary(base64ToBytes(msgAnyB64));
  };

  const getAccountInfo = (address: string, serviceAddress: string): any => {
    // Promise<{
    //   baseAccount: BaseAccount;
    //   accountNumber: number;
    //   sequence: number;
    // }>
    const accountRequest = new QueryAccountRequest();
    accountRequest.setAddress(address);
  
    return new Promise((resolve, reject) => {
      const authQuery = new AuthQueryClient(serviceAddress, null);
      resolve('test');
      //     authQuery.account(
      //       accountRequest,
      //       null,
      //       (error: ServerError, response: QueryAccountResponse) => {
      //         if (error)
      //           reject(
      //             new Error(
      //               `authQuery.account error: Code: ${error.code} Message: ${error.message}`
      //             )
      //           );
      //         else {
      //           const accountAny = response.getAccount();
      //           if (accountAny) {
      //             const baseAccount = accountAny.unpack(
      //               BaseAccount.deserializeBinary,
      //               accountAny.getTypeName()
      //             );
      //             if (baseAccount) {
      //               resolve({
      //                 baseAccount,
      //                 accountNumber: baseAccount.getAccountNumber(),
      //                 sequence: baseAccount.getSequence(),
      //               });
      //             } else reject(new Error(`authQuery.account message unpacking failure`));
      //           } else reject(new Error(`No response from authQuery.account`));
      //         }
      //       }
      //     );
    });
  };

  useEffect(() => {
    if (address && coinAddress && coin?.denom) {
      (async () => {
        console.log({ GRPC_CLIENT_ADDRESS_MAINNET, /*getAccountInfo,*/ address });
        const type = 'MsgSend';
        const sendMessage: MsgSendDisplay = {
          fromAddress: address,
          toAddress: coinAddress,
          amountList: [{ denom: coin.denom, amount: '1' }],
        };
              const msgSend = buildMessage(type, sendMessage);
              const message = createAnyMessageBase64(type, msgSend as Message);
              const msgAny = msgAnyB64toAny(message);
        const { baseAccount } = await getAccountInfo(address, GRPC_CLIENT_ADDRESS_MAINNET);
        console.log(baseAccount);
              const calculateTxFeeRequest = buildCalculateTxFeeRequest(
                msgAny,
                baseAccount,
                publicKey as unknown as Uint8Array, // SUPER HACKY BUT NEED TO TEST
                'nhash',
                19050,
                1.25
              );
              console.log(calculateTxFeeRequest);
      })();
    }
  }, [address, coin?.denom, coinAddress, coinAmount, publicKey, buildCalculateTxFeeRequest]);

  const validateAndNavigate = () => {
    if (!coinAmount) {
      return setError('An amount is required');
    }

    navigate(SEND_REVIEW_URL);
  };

  return !coin ? null : (
    <Wrapper>
      <Header
        title={`Send ${capitalize(coin.display)}`}
        iconLeft={ICON_NAMES.ARROW}
      />
      <AssetImg data={`/images/assets/${coin.display}.svg`} type="image/svg+xml">
        <Sprite
          icon={ICON_NAMES.PROVENANCE}
          color={COLORS.PRIMARY_500}
          size="10rem"
        />
      </AssetImg>
      <AssetAmount
        autoFocus
        id="sendAmount"
        placeholder="0"
        value={coinAmount}
        onChange={setCoinAmount}
        error={error}
      />
      <p>
        {coin.displayAmount} {coin.display} available
      </p>

      <TxMemo id="txMemo" placeholder="Note" value={txMemo} onChange={setMemo} />
      <p>Transaction</p>
      <Button onClick={validateAndNavigate}>Next</Button>
    </Wrapper>
  );
};
