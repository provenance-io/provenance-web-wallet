import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { getSavedData, addSavedData, clearSavedData, encrypt } from 'utils';

/**
 * TYPES
 */
interface Wallet {
  walletName?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
}
interface TempWallet extends Wallet {
  mnemonic: string
}
interface State {
  activeWalletIndex: number;
  wallets: Wallet[];
  tempWallet?: TempWallet;
  password?: string;
}

/**
 * STATE
 */
const initialState: State = {
  activeWalletIndex: getSavedData('activeWalletIndex') !== undefined ? getSavedData('activeWalletIndex') : -1,
  wallets: getSavedData('wallets') || [],
  tempWallet: undefined,
  password: '',
};

/**
 * SLICE
 */
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccountPassword: (state, { payload }) => {
      // Take user password, encode it, and save it to create new accounts
      const password = encrypt(payload, process.env.REACT_APP_LOCAL_PASS!);
      state.password = password;
    },
    signOut: (state) => {
      // Clear out sessionStorage
      clearSavedData();
      // Reset redux store state
      state = initialState;
    },
    createWallet: (state, { payload }) => {
      state.wallets.push(payload);
      const totalWallets = state.wallets.length;
      // Check if first wallet created
      state.activeWalletIndex = totalWallets - 1;
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        wallets: state.wallets,
        activeWalletIndex: state.activeWalletIndex,
      })
    },
    updateWallet: (state, { payload }) => {
      const { walletIndex, ...rest } = payload;
      const targetWallet = state.wallets[walletIndex];
      const updatedWallet = { ...targetWallet, ...rest };
      state.wallets[walletIndex] = updatedWallet;
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        wallets: state.wallets,
      })
    },
    setActiveWalletIndex: (state, { payload }) => {
      state.activeWalletIndex = payload;
      // Save wallet data into savedStorage
      addSavedData({
        activeWalletIndex: state.activeWalletIndex,
      })
    },
    updateTempWallet: (state, { payload }) => {
      state.tempWallet = {...payload, ...state.tempWallet};
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
