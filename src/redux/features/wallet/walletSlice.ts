import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import {
  getSavedData,
  addSavedData,
  clearSavedData,
  createWalletFromMasterKey,
  bytesToBase64,
  derivationPath,
  saveName,
} from 'utils';

/**
 * TYPES
 */
interface Wallet {
  walletName?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
  network?: string,
}
interface TempWallet extends Wallet {
  mnemonic: string
}
interface State {
  activeWalletIndex: number;
  wallets: Wallet[];
  tempWallet?: TempWallet;
}

/**
 * STATE
 */
const initialState: State = {
  activeWalletIndex: getSavedData('activeWalletIndex', 'localStorage') !== undefined ? getSavedData('activeWalletIndex', 'localStorage') : -1,
  wallets: getSavedData('wallets') || [],
  tempWallet: undefined,
};

/**
 * SLICE
 */
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    signOut: (state) => {
      // Clear out sessionStorage
      clearSavedData();
      // Reset redux store state
      state = initialState;
    },
    createWallet: (state, { payload }) => {
      state.wallets.push(payload);
      const totalWallets = state.wallets.length;
      const activeWalletIndex = totalWallets - 1;
      // Update active walletIndex
      state.activeWalletIndex = activeWalletIndex;
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        wallets: state.wallets,
      });
      // Save active wallet into localStorage
      addSavedData({ activeWalletIndex }, 'localStorage');
    },
    // Create multiple accounts from a single masterKey
    createHDWallet: (state, { payload }) => {
      const { masterKey, localAccountNames } = payload;
      // Loop though each accountName to create that wallet
      const accountIndexes = Object.keys(localAccountNames);
      accountIndexes.forEach(index => {
        // Build wallet (TODO: Allow testnet vs mainnet accounts)
        const path = derivationPath({ address_index: Number(index) });
        const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, undefined, path);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        const newAccountData = {
          address,
          publicKey: b64PublicKey,
          privateKey: b64PrivateKey,
          walletName: localAccountNames[index],
        };
        state.wallets.push(newAccountData);
      });
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        wallets: state.wallets,
      })
    },
    // Add a single new wallet to the masterKey
    addToHDWallet: (state, { payload }) => {
      const { masterKey, name } = payload;
      const totalWallets = state.wallets.length;
      const activeWalletIndex = totalWallets;
      // Build wallet (TODO: Allow testnet vs mainnet accounts)
      const path = derivationPath({ address_index: Number(activeWalletIndex) });
      const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, undefined, path);
      const b64PublicKey = bytesToBase64(publicKey);
      const b64PrivateKey = bytesToBase64(privateKey);
      const newAccountData = {
        address,
        publicKey: b64PublicKey,
        privateKey: b64PrivateKey,
        walletName: name,
      };
      // Update Redux Store
      state.wallets.push(newAccountData);
      state.activeWalletIndex = activeWalletIndex;
      // Update Local Browser Saved Data
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        wallets: state.wallets,
      })
      saveName(activeWalletIndex, name);
      addSavedData({ activeWalletIndex }, 'localStorage');
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
      }, 'localStorage');
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
