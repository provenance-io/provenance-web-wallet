import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { BottomFloat, Button, Content, Header, Input, Typo } from 'Components';
import {
  ICON_NAMES,
  SEND_REVIEW_URL,
  SEND_URL,
  ASSET_IMAGE_NAMES,
  DASHBOARD_URL,
} from 'consts';
import { useActiveAccount, useMessage, useSettings } from 'redux/hooks';
import {
  capitalize,
  hashFormat,
  getTxFeeEstimate,
  getMessageAny,
  currencyFormat,
} from 'utils';
import { COLORS } from 'theme';
import { useGetAssetsQuery } from 'redux/services';

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
  const { customGRPCApi } = useSettings();
  const [errorAmount, setErrorAmount] = useState('');
  const [errorMemo, setErrorMemo] = useState('');
  const [txFeeLoading, setTxFeeLoading] = useState(false);
  const {
    coin,
    coinAmount,
    displayAmount,
    setCoinAmount,
    setDisplayAmount,
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
  const { publicKey, address } = useActiveAccount();
  // Fetch Assets
  const { data: assetData = [] } = useGetAssetsQuery(address!);
  const sendAsset = assetData.find(({ denom }) => coin!.denom === denom)!;

  // Coin amount is the "displayAmount" of coin the user is sending
  // EG: 10 Hash, even though when sending we will send 10000000000 nhash
  const convertCoinAmount = (amount: string | number, exponent: string | number) =>
    Number(`${amount}E${exponent}`);

  // On page load, if there isn't a sendAddress (skipped /send page) redirect to send
  useEffect(() => {
    if (!txSendAddress) navigate(DASHBOARD_URL);
  }, [txSendAddress, navigate]);

  // Any time coin amount changes (and it's >0), calculate the txFeeEstimates
  useEffect(() => {
    if (!errorAmount) {
      if (displayAmount && displayAmount !== '0') {
        setTxFeeLoading(true);
        const asyncAction = async () => {
          const finalCoinAmount = convertCoinAmount(
            displayAmount,
            sendAsset.exponent
          );
          const sendMessage = {
            amountList: [{ denom: sendAsset.denom, amount: `${finalCoinAmount}` }],
            fromAddress: txFromAddress!,
            toAddress: txSendAddress!,
          };
          const msgAny = getMessageAny(txType!, sendMessage);
          setTxMsgAny(msgAny);
          const { txFeeEstimate, txGasEstimate } = await getTxFeeEstimate({
            address: txFromAddress!,
            msgAny,
            publicKey: publicKey!,
            customGRPCApi,
          });
          setTxFees({ txFeeEstimate, txGasEstimate });
          if (!txGasEstimate) {
            setErrorAmount('Unable to calculate transaction fee');
          }
          setTxFeeLoading(false);
        };
        asyncAction();
      } else setTxFees({ txFeeEstimate: [], txGasEstimate: 0 });
    }
  }, [
    displayAmount,
    publicKey,
    setTxFees,
    coin,
    txFromAddress,
    txSendAddress,
    txType,
    setTxMsgAny,
    customGRPCApi,
    errorAmount,
    sendAsset.denom,
    sendAsset.exponent,
  ]);

  const validateAndNavigate = () => {
    if (!coinAmount) setErrorAmount('An amount is required');
    if (txMemo && txMemo.length > 30) setErrorMemo('Max memo length 30');
    if (!errorAmount && !errorMemo) navigate(SEND_REVIEW_URL);
  };

  const calculatePriceUSD = () => {
    let value = '0.00';
    if (displayAmount && sendAsset) {
      // User enters the amount based on "display"
      // Need to convert displayAmount to amount based on exponent, then calculate w/usdPrice
      const finalAmount = convertCoinAmount(displayAmount, sendAsset.exponent);
      value = currencyFormat(finalAmount * sendAsset.usdPrice);
    }
    return `~$${value} USD`;
  };

  const handleAmountChange = (newDisplayAmount: string) => {
    // Check to see if account has enough displayDenom to cover send amount
    const newErrorAmount =
      Number(newDisplayAmount) > Number(coin!.displayAmount)
        ? 'Insufficient funds'
        : '';
    setErrorAmount(newErrorAmount);
    const finalAmount = convertCoinAmount(newDisplayAmount, sendAsset.exponent);
    setDisplayAmount(newDisplayAmount);
    setCoinAmount(finalAmount);
  };

  const assetIconName =
    coin?.display && ASSET_IMAGE_NAMES.includes(coin.display)
      ? coin.display
      : 'provenance';

  return !coin ? null : (
    <Content>
      <Header
        title={`Send ${capitalize(coin.display, 'uppercase')}`}
        iconLeft={ICON_NAMES.ARROW}
        backLocation={SEND_URL}
      />
      <AssetImg src={`/images/assets/${assetIconName}.svg`} />
      <AssetAmount
        autoFocus
        id="sendAmount"
        placeholder="0"
        value={displayAmount}
        onChange={handleAmountChange}
        error={errorAmount}
        type="number"
      />
      <Typo type="displayBody">
        {Number(coin.displayAmount).toFixed(2)}{' '}
        {capitalize(coin.display, 'uppercase')} available
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
            error={errorMemo}
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
                ? `${hashFormat(txFeeEstimate + txGasEstimate!, 'nhash').toFixed(
                    4
                  )} Hash`
                : 'N/A'}
            </Uppercase>
          </Typo>
        </RowValue>
      </StyledRow>
      <BottomFloat>
        <Button
          onClick={validateAndNavigate}
          disabled={!!txFeeLoading || !!errorAmount || !!errorMemo}
        >
          Next
        </Button>
      </BottomFloat>
    </Content>
  );
};
