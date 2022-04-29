import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import {
  getSavedData,
  addSavedData,
  clearSavedData,
  createWalletFromMasterKey,
  bytesToBase64,
  derivationPath,
  saveAccount,
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
  id?: number,
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
      const { walletName: name, network, id } = payload;
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
      saveAccount({ name, network, id });
    },
    // Create multiple accounts from a single masterKey
    createHDWallet: (state, { payload }) => {
      interface AccountType {
        id: number,
        name: string,
        network: string,
      }
      const { masterKey, localAccounts } = payload;
      // Loop though each account to create that wallet account
      localAccounts.forEach((account: AccountType) => {
        const {id, name, network} = account;
        const path = derivationPath({ address_index: Number(id) });
        const prefix = network === 'mainnet' ?
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_MAINNET :
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_TESTNET;
        const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, prefix, path);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        const newAccountData = {
          address,
          publicKey: b64PublicKey,
          privateKey: b64PrivateKey,
          walletName: name,
          network,
          id,
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
      const { masterKey, name, network } = payload;
      const totalWallets = state.wallets.length;
      const activeWalletIndex = totalWallets;
      // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
      const sortedWallets = state.wallets.sort((a, b) => a.id! < b.id! ? 1 : -1);
      const highestId = sortedWallets[0].id || 0;
      const id = highestId + 1;
      
      const prefix = network === 'mainnet' ?
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_MAINNET :
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_TESTNET;
      const path = derivationPath({ address_index: Number(activeWalletIndex) });
      const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, prefix, path);
      const b64PublicKey = bytesToBase64(publicKey);
      const b64PrivateKey = bytesToBase64(privateKey);
      const newAccountData = {
        address,
        publicKey: b64PublicKey,
        privateKey: b64PrivateKey,
        walletName: name,
        id,
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
      saveAccount({ id, name, network });
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
