import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';

/**
 * TYPES
 */
interface Wallet {
  mnemonic?: string,
  accountName?: string,
  publicKey?: string,
  b64PrivateKey?: string,
  b64PublicKey?: string,
  privateKey?: string,
}
interface State {
  activeWalletIndex: number,
  wallets: Wallet[];
  tempWallet?: Wallet;
}

/**
 * STATE
 */
const initialState: State = {
  activeWalletIndex: -1,
  wallets: [],
  tempWallet: undefined,
};

/**
 * SLICE
 */
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    createWallet: (state, action) => {
      state.wallets.push(action.payload);
      const totalWallets = state.wallets.length;
      state.activeWalletIndex = totalWallets;
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
    updateTempWallet: (state, action) => {
      state.tempWallet = {...action.payload, ...state.tempWallet};
    },
    clearTempWallet: (state) => {
      state.tempWallet = undefined;
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
