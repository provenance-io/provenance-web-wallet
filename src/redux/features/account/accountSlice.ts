import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import {
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
interface Account {
  name?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
  network?: string,
  id?: number,
}
interface TempAccount extends Account {
  mnemonic: string
}
interface State {
  activeAccountIndex: number;
  accounts: Account[];
  tempAccount?: TempAccount;
  initialLoad: boolean;
}

/**
 * STATE
 */
const initialState: State = {
  activeAccountIndex: -1,
  accounts: [],
  tempAccount: undefined,
  initialLoad: true,
};

/**
 * SLICE
 */
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setInitialValues: (state, { payload }) => {
      const { accounts, activeAccountIndex } = payload
      if (accounts) state.accounts = accounts;
      if (activeAccountIndex !== undefined) state.activeAccountIndex = activeAccountIndex;
      state.initialLoad = false;
    },
    signOut: (state) => {
      // Clear out sessionStorage
      clearSavedData();
      // Reset redux store state
      state = initialState;
    },
    addAccount: (state, { payload }) => {
      state.accounts.push(payload);
      state.activeAccountIndex = payload.id;
    },
    addAccounts: (state, { payload }) => {
      const { accounts, activeAccountIndex } = payload;
      state.accounts.push(...accounts);
      state.activeAccountIndex = activeAccountIndex;
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
        const { id, name, network } = account;
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
          name,
          network,
          id,
        };
        state.accounts.push(newAccountData);
      });
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        accounts: state.accounts,
      })
    },
    // Add a single new wallet to the masterKey
    addToHDWallet: (state, { payload }) => {
      const { masterKey, name, network } = payload;
      const totalWallets = state.accounts.length;
      const activeAccountIndex = totalWallets;
      // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
      const sortedWallets = state.accounts.sort((a, b) => a.id! < b.id! ? 1 : -1);
      const highestId = sortedWallets[0].id || 0;
      const id = highestId + 1;
      
      const prefix = network === 'mainnet' ?
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_MAINNET :
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_TESTNET;
      const path = derivationPath({ address_index: Number(activeAccountIndex) });
      const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, prefix, path);
      const b64PublicKey = bytesToBase64(publicKey);
      const b64PrivateKey = bytesToBase64(privateKey);
      const newAccountData = {
        address,
        publicKey: b64PublicKey,
        privateKey: b64PrivateKey,
        name,
        id,
      };
      // Update Redux Store
      state.accounts.push(newAccountData);
      state.activeAccountIndex = activeAccountIndex;
      // Update Local Browser Saved Data
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        accounts: state.accounts,
      })
      saveAccount({ id, name, network });
      addSavedData({ activeAccountIndex }, 'localStorage');
    },
    updateWallet: (state, { payload }) => {
      const { walletIndex, ...rest } = payload;
      const targetWallet = state.accounts[walletIndex];
      const updatedWallet = { ...targetWallet, ...rest };
      state.accounts[walletIndex] = updatedWallet;
      // Save wallet data into savedStorage
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        accounts: state.accounts,
      })
    },
    setActiveAccountIndex: (state, { payload }) => {
      state.activeAccountIndex = payload;
      // Save wallet data into savedStorage
      addSavedData({
        activeAccountIndex: state.activeAccountIndex,
      }, 'localStorage');
    },
    updatetempAccount: (state, { payload }) => {
      state.tempAccount = {...payload, ...state.tempAccount};
    },
    cleartempAccount: (state) => {
      state.tempAccount = undefined;
    },
  },
});

/**
 * ACTIONS
 */
export const accountActions = accountSlice.actions;

/**
 * SELECTORS
 */
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
