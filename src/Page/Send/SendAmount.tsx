import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Content, Header, Input } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL } from 'consts';
import { useActiveAccount, useMessage, usePricing } from 'redux/hooks';
import { capitalize, getGrpcApi } from 'utils';
import { convertUtf8ToBuffer } from '@walletconnect/utils';
import { GrpcService, } from '@provenanceio/wallet-lib';
import { Message } from 'google-protobuf';
import { COLORS } from 'theme';
import {
  buildCalculateTxFeeRequest,
  buildMessage,
  createAnyMessageBase64,
  getAccountInfo,
  msgAnyB64toAny,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';

const AssetImg = styled.img`
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
  border-bottom: 1px solid ${COLORS.NEUTRAL_700};
`;

export const SendAmount = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { coin, coinAddress, coinAmount, setCoinAmount, txMemo, setMemo } =
    useMessage();
  const { queryPricingEngine, priceEnginePrices } = usePricing();
  const { address, publicKey } = useActiveAccount();
  
  useEffect(() => {
    if (address && coinAddress && coin?.denom) {
      (async () => {
        const grpcAddress = getGrpcApi(address);
        const grpcService = new GrpcService(grpcAddress);
        const method = 'provenance_sendTransaction';
        const type = 'MsgSend';
        const gasPrice = 19050;
        const description = `Send Coin (${coin.denom})`;
        const sendMessage = {
          amountList: [{ denom: coin.denom, amount: coinAmount!}],
          fromAddress: address,
          toAddress: coinAddress,
        };
        const metadata = JSON.stringify({
          description,
          address,
          gasPrice,
          date: Date.now(),
        });
        const request = {
          id: Math.random().toString().slice(2, 16 + 2), // Generate a random id to use
          jsonrpc: '2.0',
          method,
          params: [metadata],
        };
        const messageMsgSend = buildMessage(type, sendMessage);
        const messageB64String = createAnyMessageBase64(type, messageMsgSend as Message);
        // const { baseAccount } = await getAccountInfo(address, grpcAddress);
        // const calculateTxFeeRequest = buildCalculateTxFeeRequest({
        //   msgAny,
        //   account: baseAccount,
        //   publicKey: convertUtf8ToBuffer(publicKey!), 
        //   gasPriceDenom: 'nhash',
        //   gasPrice: 19050,
        //   gasAdjustment: 1.25,
        // });
        // console.log('grpcAddress :', grpcAddress);
        // console.log('sendMessage :', sendMessage);
        // console.log('request :', request);
        // console.log('msgAny :', msgAny);
        // console.log('baseAccount :', baseAccount);
        // console.log('calculateTxFeeRequest :', calculateTxFeeRequest);
        /*
        txBytes: Uint8Array | string,
        mode: BroadcastMode,
          - export enum BroadcastMode {
              BROADCAST_MODE_UNSPECIFIED = 0,
              BROADCAST_MODE_BLOCK = 1,
              BROADCAST_MODE_SYNC = 2,
              BROADCAST_MODE_ASYNC = 3,
            }
        */
        grpcService.broadcastTx({ txBytes: messageB64String, mode: 0 });
      })();
    }
  }, [address, coin?.denom, coinAddress, coinAmount, publicKey]);

  useEffect(() => {
    if (coin) {
      queryPricingEngine({ denom: [coin.denom] });
    }
  }, [coin, queryPricingEngine]);

  const validateAndNavigate = () => {
    if (!coinAmount) {
      return setError('An amount is required');
    }

    navigate(SEND_REVIEW_URL);
  };

  return !coin ? null : (
    <Content>
      <Header
        title={`Send ${capitalize(coin.display)}`}
        iconLeft={ICON_NAMES.ARROW}
      />
      <AssetImg src={`/images/assets/${coin.display}.svg`} />
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
      <p>
        {coinAmount && priceEnginePrices[coin.denom]
          ? `$${priceEnginePrices[coin.denom]?.usdPrice * Number(coinAmount)}`
          : ''}
      </p>
      <TxMemo id="txMemo" placeholder="Note" value={txMemo} onChange={setMemo} />
      <p>Transaction</p>
      <Button onClick={validateAndNavigate}>Next</Button>
    </Content>
  );
};
