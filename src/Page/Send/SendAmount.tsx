import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Header, Input, Sprite } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL } from 'consts';
import { useActiveAccount, useMessage, usePricing } from 'redux/hooks';
import { capitalize, getGrpcApi } from 'utils';
import { COLORS, COLOR_VARIABLES } from 'theme';
// import { Message } from 'google-protobuf';
import {
  buildCalculateTxFeeRequest,
  buildMessage,
  createAnyMessageBase64,
  // grpcService,
  // getAccountInfo,
  msgAnyB64toAny,
  MsgSendDisplay,
} from '@provenanceio/wallet-utils';

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
  const { queryPricingEngine, priceEnginePrices } = usePricing();
  const { address, publicKey } = useActiveAccount();

  useEffect(() => {
    if (address && coinAddress && coin?.denom) {
      (async () => {
        const grpcAddress = getGrpcApi(address);
        console.log({ grpcAddress, /*getAccountInfo,*/ address });
        // const type = 'MsgSend';
        // const sendMessage: MsgSendDisplay = {
        //   fromAddress: address,
        //   toAddress: coinAddress,
        //   amountList: [{ denom: coin.denom, amount: coinAmount }],
        // };
        //       const msgSend = buildMessage(type, sendMessage);
        //       const message = createAnyMessageBase64(type, msgSend as Message);
        //       const msgAny = msgAnyB64toAny(message);
        // const { baseAccount } = await getAccountInfo(address, grpcAddress);
        // console.log(baseAccount);
        //       const calculateTxFeeRequest = buildCalculateTxFeeRequest(
        //         msgAny,
        //         baseAccount,
        //         publicKey as unknown as Uint8Array, // SUPER HACKY BUT NEED TO TEST
        //         'nhash',
        //         19050,
        //         1.25
        //       );
        //       console.log(calculateTxFeeRequest);
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
      <p>
        {coinAmount && priceEnginePrices[coin.denom]
          ? `$${priceEnginePrices[coin.denom]?.usdPrice * Number(coinAmount)}`
          : ''}
      </p>
      <TxMemo id="txMemo" placeholder="Note" value={txMemo} onChange={setMemo} />
      <p>Transaction</p>
      <Button onClick={validateAndNavigate}>Next</Button>
    </Wrapper>
  );
};
