import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Message } from 'types';

const initialState: Message = {
  coinAddress: '',
  coinAmount: undefined,
  coin: undefined,
  txMemo: undefined,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // SEND COIN
    setCoinAddress(state, action) {
      state.coinAddress = action.payload;
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
  },
});

export const messageActions = messageSlice.actions;

/**
 * SELECTORS
 */
export const selectMessage = (state: RootState) => state.message;

export default messageSlice.reducer;