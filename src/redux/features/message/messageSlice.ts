import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import type { Message as MessageSlice, CoinAsObject } from 'types';

const initialState: MessageSlice = {
  coin: undefined,
  coinAmount: '',
  displayAmount: '',
  txBaseAccount: '',
  txDate: undefined,
  txFeeDenom: 'nhash',
  txFeeEstimate: undefined,
  txFeeEstimateCoins: undefined,
  txFromAddress: '',
  txGasEstimate: undefined,
  txMemo: '',
  txMsgAny: undefined,
  txSendAddress: '',
  txType: 'MsgSend',
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

    setDisplayAmount(state, action) {
      state.displayAmount = action.payload;
    },

    setCoin(state, action) {
      console.log('messageSlice.ts | setCoin: ', action.payload);
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
      // txFeeEstimate comes in as an array of denoms and amounts.  Only care about nhash within messageSlice actions
      // Pull out all nhash fees into an array
      const nhashFeesArray = txFeeEstimate.filter(
        ({ denom }: CoinAsObject) => denom === 'nhash'
      );
      const nhashFeeTotal = nhashFeesArray.reduce(
        (total: number, { amount: nhashAmount }: CoinAsObject) =>
          total + Number(nhashAmount),
        txGasEstimate
      );
      state.txFeeEstimateCoins = txFeeEstimate;
      state.txFeeEstimate = nhashFeeTotal;
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
