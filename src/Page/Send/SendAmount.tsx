import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { BottomFloat, Button, Content, Header, Input, Typo } from 'Components';
import { ICON_NAMES, SEND_REVIEW_URL, SEND_URL } from 'consts';
import { useActiveAccount, useMessage, useAddress } from 'redux/hooks';
import { capitalize, hashFormat, getTxFeeEstimate, getMessageAny } from 'utils';
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
  padding: 10px 0;
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
  const {
    coin,
    coinAmount,
    setCoinAmount,
    txMemo,
    setMemo,
    txFeeEstimate,
    txGasEstimate,
    setTxFees,
    txFromAddress,
    txSendAddress,
    txType,
    setTxMsgAny,
  } = useMessage();
  const { assets } = useAddress();
  const { publicKey } = useActiveAccount();

  // Any time coin amount changes (and it's >0), calculate the txFeeEstimates
  useEffect(() => {
    if (!errors[0]) {
      if (coinAmount) {
        const asyncAction = async () => {
          // If coinAmount is referring to 'HASH' convery amount to nhash
          const finalCoinAmount =
            coin?.denom === 'nhash' ? hashFormat(coinAmount, 'hash') : coinAmount;
          const sendMessage = {
            amountList: [{ denom: coin!.denom, amount: `${finalCoinAmount}` }],
            fromAddress: txFromAddress!,
            toAddress: txSendAddress!,
          };
          const msgAny = getMessageAny(txType!, sendMessage);
          setTxMsgAny(msgAny);
          const { txFeeEstimate, txGasEstimate } = await getTxFeeEstimate({
            address: txFromAddress!,
            msgAny,
            publicKey: publicKey!,
          });
          setTxFees({ txFeeEstimate, txGasEstimate });
        };
        asyncAction();
      } else setTxFees({ txFeeEstimate: 0, txGasEstimate: 0 });
    }
  }, [
    coinAmount,
    publicKey,
    setTxFees,
    coin,
    txFromAddress,
    txSendAddress,
    txType,
    setTxMsgAny,
    errors,
  ]);

  const validateAndNavigate = () => {
    let newErrors = [];
    if (!coinAmount) newErrors[0] = 'An amount is required';
    if (txMemo && txMemo.length > 30) newErrors[1] = 'Max memo length 30';
    setErrors(newErrors);
    if (!newErrors.length) navigate(SEND_REVIEW_URL);
  };

  const calculatePriceUSD = () => {
    let value = '0.00';
    const assetData = assets.find(({ denom }) => coin!.denom === denom);
    if (coinAmount && assetData) {
      const nhashAmount = hashFormat(coinAmount, 'hash');
      value = `${(assetData.usdPrice * nhashAmount).toFixed(2)}`;
    }
    return `~$${value} USD`;
  };

  const handleAmountChange = (amount: string) => {
    const newErrors = [...errors];
    newErrors[0] =
      Number(amount) +
        Number(hashFormat(txFeeEstimate || 0, 'nhash')) +
        Number(hashFormat(txGasEstimate || 0, 'nhash')) >
      Number(coin!.displayAmount)
        ? 'Insufficient funds'
        : '';
    setErrors(newErrors);
    setCoinAmount(amount);
  };

  return !coin ? null : (
    <Content>
      <Header
        title={`Send ${capitalize(coin.display)}`}
        iconLeft={ICON_NAMES.ARROW}
        backLocation={SEND_URL}
      />
      <AssetImg src={`/images/assets/${coin.display}.svg`} />
      <AssetAmount
        autoFocus
        id="sendAmount"
        placeholder="0"
        value={coinAmount}
        onChange={handleAmountChange}
        error={errors[0]}
        type="number"
      />
      <Typo type="displayBody">
        {Number(coin.displayAmount).toFixed(2)} <Uppercase>{coin.display}</Uppercase>{' '}
        available
      </Typo>
      <Typo type="displayBody" marginBottom="64px">
        {calculatePriceUSD()}
      </Typo>
      <StyledRow>
        <RowTitle>
          <Typo type="body">Note</Typo>
        </RowTitle>
        <RowValue>
          <TxMemo
            id="txMemo"
            placeholder="Click to add note (optional)"
            value={txMemo}
            onChange={setMemo}
            error={errors[1]}
          />
        </RowValue>
      </StyledRow>
      <StyledRow>
        <RowTitle>
          <Typo type="body">Transaction Fee</Typo>
        </RowTitle>
        <RowValue>
          <Typo type="body" align="right">
            <Uppercase>
              {txFeeEstimate
                ? `${(
                    hashFormat(txFeeEstimate, 'nhash') +
                    hashFormat(txGasEstimate!, 'nhash')
                  ).toFixed(4)} ${coin.display}`
                : 'N/A'}
            </Uppercase>
          </Typo>
        </RowValue>
      </StyledRow>
      <BottomFloat>
        <Button onClick={validateAndNavigate}>Next</Button>
      </BottomFloat>
    </Content>
  );
};
