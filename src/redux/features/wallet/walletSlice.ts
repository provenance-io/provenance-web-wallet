import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';

/**
 * TYPES
 */
interface State {
  activeWalletIndex: number,
  wallets: {
    mnemonic?: string,
    accountName?: string,
    publicKey?: string,
    privateKey?: string,
  }[];
}

/**
 * STATE
 */
const initialState: State = {
  activeWalletIndex: -1,
  wallets: [],
};

/**
 * SLICE
 */
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    createWallet: (state, action) => {
      const { mnemonic, walletName, publicKey, privateKey } = action.payload;
      const finalWallet = { mnemonic, walletName, publicKey, privateKey };
      state.wallets.push(finalWallet);
    },
    updateWallet: (state, action) => {
      const { walletIndex, ...rest } = action.payload;
      const targetWallet = state.wallets[walletIndex];
      const updatedWallet = { ...targetWallet, ...rest };
      state.wallets[walletIndex] = updatedWallet;
    },
    setActiveWalletIndex: (state, action) => {
      state.activeWalletIndex = action.payload;
    },
  },
});

/**
 * ACTIONS
 */
export const walletActions = walletSlice.actions;

/**
 * SELECTORS
 */
export const selectWallet = (state: RootState) => state.wallet;

export default walletSlice.reducer;
