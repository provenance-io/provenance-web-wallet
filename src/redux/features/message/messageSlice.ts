import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Message as MessageSlice } from 'types';

const initialState: MessageSlice = {
  coin: undefined,
  coinAmount: undefined,
  txBaseAccount: undefined,
  txDate: undefined,
  txFeeDenom: 'nhash',
  txFeeEstimate: undefined,
  txFromAddress: undefined,
  txGasEstimate: undefined,
  txGasPrice: 19050, // TODO: Dynamically get gas price
  txGasPriceAdjustment: 1.25, // TODO: Dynamically get gas price adjustment
  txGasPriceDenom: 'nhash',
  txMemo: undefined,
  txMsgAny: undefined,
  txSendAddress: undefined,
  txType: 'MsgSend', // TODO: Make Dynamic
  txResponse: '',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // SEND COIN
    setTxSendAddress(state, action) {
      state.txSendAddress = action.payload;
    },

    setTxFromAddress(state, action) {
      state.txFromAddress = action.payload;
    },

    setCoinAmount(state, action) {
      state.coinAmount = action.payload;
    },

    setCoin(state, action) {
      state.coin = action.payload;
    },

    setMemo(state, action) {
      state.txMemo = action.payload;
    },

    setTxDate(state, action) {
      state.txDate = action.payload;
    },

    setTxFees(state, action) {
      const { txFeeEstimate, txGasEstimate } = action.payload;
      state.txFeeEstimate = txFeeEstimate;
      state.txGasEstimate = txGasEstimate;
    },

    setTxMsgAny(state, action) {
      state.txMsgAny = action.payload;
    },

    setTxResponse(state, { payload }) {
      state.txResponse = payload;
    },

    resetMessage: () => initialState,
  },
});

export const messageActions = {
  ...messageSlice.actions,
};

/**
 * SELECTORS
 */
export const selectMessage = (state: RootState) => state.message;

export default messageSlice.reducer;
