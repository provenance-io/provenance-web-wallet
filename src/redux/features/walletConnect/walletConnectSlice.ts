import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import WalletConnectClient from "@walletconnect/client";

/**
 * TYPES
 */

interface State {
  uri: string,
  connected: boolean,
  connector: WalletConnectClient | null,
}

/**
 * STATE
 */
const initialState: State = {
  uri: '',
  connected: false,
  connector: null,
};

/**
 * SLICE
 */
const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    setUri: (state, { payload }) => {
      state.uri = payload;
    },
    clearUri: (state) => {
      state.uri = '';
    },
    setConnector: (state, { payload }) => {
      state.connector = payload;
    },
    setConnected: (state, { payload }) => {
      state.connected = payload;
    },
  },
});

/**
 * ACTIONS
 */
export const walletConnectActions = walletConnectSlice.actions;

/**
 * SELECTORS
 */
export const selectWalletConnect = (state: RootState) => state.walletConnect;

export default walletConnectSlice.reducer;
