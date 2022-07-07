import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Content, Header, Input } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL } from 'consts';
import { useMessage, usePricing } from 'redux/hooks';
import { capitalize } from 'utils';
import { COLORS } from 'theme';

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
  const { coin, coinAmount, setCoinAmount, txMemo, setMemo } =
    useMessage();
  const { queryPricingEngine, priceEnginePrices } = usePricing();
  
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
