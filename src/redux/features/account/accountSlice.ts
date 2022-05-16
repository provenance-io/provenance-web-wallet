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
import { PROVENANCE_ADDRESS_PREFIX_MAINNET, PROVENANCE_ADDRESS_PREFIX_TESTNET } from 'consts';

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
  activeAccountId: number;
  accounts: {[key: number]: Account};
  tempAccount?: TempAccount;
  initialLoad: boolean;
}

/**
 * STATE
 */
const initialState: State = {
  activeAccountId: -1,
  accounts: {},
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
      const { accounts, activeAccountId: passedActiveAccountIndex } = payload
      if (accounts) state.accounts = accounts;
      // Either use the passed in payload, or get one from the passed in accounts
      const activeAccountId = passedActiveAccountIndex || Object.keys(accounts)[0];
      state.activeAccountId = activeAccountId;
      state.initialLoad = false;
    },
    signOut: (state) => {
      // Clear out sessionStorage
      clearSavedData();
      // Reset redux store state
      state = initialState;
    },
    addAccount: (state, { payload }) => {
      state.accounts = { ...state.accounts, [payload.id]: payload };
      state.activeAccountId = payload.id;
    },
    addAccounts: (state, { payload }) => {
      const { accounts, activeAccountId } = payload;
      state.accounts = { ...state.accounts, ...accounts};
      state.activeAccountId = activeAccountId;
    },
    // Create multiple accounts from a single masterKey
    // createHDWallet: (state, { payload }) => {
    //   interface AccountType {
    //     id: number,
    //     name: string,
    //     network: string,
    //   }
    //   const { masterKey, localAccounts } = payload;
    //   // Loop though each account to create that wallet account
    //   localAccounts.forEach((account: AccountType) => {
    //     const { id, name, network } = account;
    //     const path = derivationPath({ address_index: Number(id) });
    //     const prefix = network === 'mainnet' ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
    //     const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, prefix, path);
    //     const b64PublicKey = bytesToBase64(publicKey);
    //     const b64PrivateKey = bytesToBase64(privateKey);
    //     const newAccountData = {
    //       address,
    //       publicKey: b64PublicKey,
    //       privateKey: b64PrivateKey,
    //       name,
    //       network,
    //       id,
    //     };
    //     state.accounts.push(newAccountData);
    //   });
    //   // Save wallet data into savedStorage
    //   addSavedData({
    //     connected: true,
    //     connectedIat: new Date().getTime(),
    //     accounts: state.accounts,
    //   })
    // },
    // Add a single new wallet to the masterKey
    addToHDWallet: (state, { payload }) => {
      const { masterKey, name, network } = payload;
      const accountArray = Object.keys(state.accounts).map((key: string) => state.accounts[Number(key)]);
      const activeAccountId = accountArray.length;
      // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
      const sortedWallets = accountArray.sort((a, b) => a.id! < b.id! ? 1 : -1);
      const highestId = sortedWallets[0].id || 0;
      const id = highestId + 1;
      
      const prefix = network === 'mainnet' ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
      const path = derivationPath({ address_index: Number(activeAccountId) });
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
      state.accounts = { ...state.accounts, [id]: newAccountData };
      state.activeAccountId = activeAccountId;
      // Update Local Browser Saved Data
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        accounts: state.accounts,
      })
      saveAccount({ id, name, network });
      addSavedData({ activeAccountId });
    },
    // updateWallet: (state, { payload }) => {
    //   const { walletIndex, ...rest } = payload;
    //   const targetWallet = state.accounts[walletIndex];
    //   const updatedWallet = { ...targetWallet, ...rest };
    //   state.accounts[walletIndex] = updatedWallet;
    //   // Save wallet data into savedStorage
    //   addSavedData({
    //     connected: true,
    //     connectedIat: new Date().getTime(),
    //     accounts: state.accounts,
    //   })
    // },
    setActiveAccountIndex: (state, { payload }) => {
      state.activeAccountId = payload;
      // Save wallet data into savedStorage
      addSavedData({
        activeAccountId: state.activeAccountId,
      });
    },
    updateTempAccount: (state, { payload }) => {
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
