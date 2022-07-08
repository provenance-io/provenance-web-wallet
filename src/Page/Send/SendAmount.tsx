import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { BottomFloat, Button, Content, Header, Input, Typo } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL } from 'consts';
import { useMessage, usePricing } from 'redux/hooks';
import { capitalize } from 'utils';
import { COLORS } from 'theme';

const AssetImg = styled.img`
  width: 100px;
  max-width: 113px;
  display: flex;
  margin: 0 auto;
`;

const AssetAmount = styled(Input)`
  margin: 12px 0 16px;
  border: none;
  color: ${COLORS.WHITE};
  font-size: 4.4rem;
  font-family: 'Montserrat';
  text-align: center;
`;
const StyledRow = styled.div`
  border-bottom: 1px solid ${COLORS.NEUTRAL_700};
  margin-top: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const RowTitle = styled.div`
  margin-right: 20px;
`;
const RowValue = styled.div`
  flex-grow: 1;
`;
const TxMemo = styled(Input)`
  border: none;
  text-align: right;
`;
const Uppercase = styled.span`
  text-transform: uppercase;
`;

export const SendAmount = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]); // [AmountError, MemoError]
  const { coin, coinAmount, setCoinAmount, txMemo, setMemo } =
    useMessage();
  const { queryPricingEngine, priceEnginePrices } = usePricing();
  
  useEffect(() => {
    if (coin) {
      queryPricingEngine({ denom: [coin.denom] });
    }
  }, [coin, queryPricingEngine]);

  const validateAndNavigate = () => {
    let newErrors = [];
    if (!coinAmount) newErrors[0] = 'An amount is required';
    if (txMemo && txMemo.length > 30) newErrors[1] = 'Max memo length 30';
    setErrors(newErrors);
    if (!newErrors.length) navigate(SEND_REVIEW_URL);
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
        error={errors[0]}
      />
      <Typo type="displayBody">
        {Number(coin.displayAmount).toFixed(2)} <Uppercase>{coin.display}</Uppercase> available
      </Typo>
      <Typo type="displayBody">
        ${coinAmount && priceEnginePrices[coin.denom]
          ? `${(priceEnginePrices[coin.denom]?.usdPrice * Number(coinAmount)).toFixed(2)}`
          : '0.00'} USD
      </Typo>
      <StyledRow>
        <RowTitle>
          <Typo type="body">Note</Typo>
        </RowTitle>
        <RowValue>
          <TxMemo id="txMemo" placeholder="Click to add note (optional)" value={txMemo} onChange={setMemo} error={errors[1]} />
        </RowValue>
      </StyledRow>
      <BottomFloat>
        <Button onClick={validateAndNavigate}>Next</Button>
      </BottomFloat>
    </Content>
  );
};
