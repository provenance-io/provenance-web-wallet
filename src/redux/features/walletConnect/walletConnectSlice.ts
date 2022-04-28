import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import WalletConnectClient from "@walletconnect/client";

/**
 * TYPES
 */

interface State {
  connected: boolean,
  connector: WalletConnectClient | null,
  activeEvent?: string,
  connectionDetails: {} | null,
}

/**
 * STATE
 */
const initialState: State = {
  connected: false,
  connector: null,
  activeEvent: '',
  connectionDetails: null,
};

/**
 * SLICE
 */
const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    setConnector: (state, { payload }) => {
      state.connector = payload;
    },
    setConnected: (state, { payload }) => {
      state.connected = payload;
    },
    setConnectionDetails: (state, { payload }) => {
      state.connectionDetails = payload;
    },
    createConnector: (state, { payload: uri }) => {
      const connector = new WalletConnectClient({ uri });
      state.connector = connector;
    }
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
