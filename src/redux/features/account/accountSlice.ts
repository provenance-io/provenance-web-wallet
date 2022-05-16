import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import {
  addSavedData,
  clearSavedData,
  createWalletFromMasterKey,
  bytesToBase64,
  derivationPath,
} from 'utils';
import { PROVENANCE_ADDRESS_PREFIX_MAINNET, PROVENANCE_ADDRESS_PREFIX_TESTNET } from 'consts';
import { Account } from 'types';

/**
 * TYPES
 */
interface TempAccount extends Account {
  mnemonic: string
}
interface State {
  activeAccountId?: number;
  accounts: Account[];
  tempAccount?: TempAccount;
  initialLoad: boolean;
}

/**
 * STATE
 */
const initialState: State = {
  activeAccountId: -1,
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
      const { accounts, activeAccountId } = payload
      if (accounts) state.accounts = accounts;
      // Either use the passed in payload, or get one from the passed in accounts
      state.activeAccountId = activeAccountId || accounts[0].id;
      state.initialLoad = false;
    },
    signOut: (state) => {
      // Clear out sessionStorage
      clearSavedData();
      // Reset redux store state
      state = initialState;
    },
    // add 1 or more accounts
    addAccount: (state, { payload }) => {
      const { accounts, activeAccountId } = payload
      state.accounts.push(accounts);
      // Either use the passed in payload, or get one from the passed in accounts
      state.activeAccountId = activeAccountId || accounts[0].id;
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
      // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
      const sortedWallets = state.accounts.sort((a, b) => a.id! < b.id! ? 1 : -1);
      const highestId = sortedWallets[0].id || 0;
      const id = highestId + 1;
      const prefix = network === 'mainnet' ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
      const path = derivationPath({ address_index: id });
      const { address, publicKey, /* privateKey */ } = createWalletFromMasterKey(masterKey, prefix, path);
      const b64PublicKey = bytesToBase64(publicKey);
      // const b64PrivateKey = bytesToBase64(privateKey);
      const newAccountData = {
        address,
        publicKey: b64PublicKey,
        // privateKey: b64PrivateKey,
        name,
        network,
        id,
      };
      // Update Redux Store
      state.accounts.push(newAccountData);
      state.activeAccountId = id;
      // Update Local Browser Saved Data (Chrome Storage)
      addSavedData({
        connected: true,
        connectedIat: new Date().getTime(),
        accounts: state.accounts,
        activeAccountId: id,
      })
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
    setActiveAccountId: (state, { payload }) => {
      state.activeAccountId = payload;
      // Save wallet data into savedStorage
      addSavedData({
        activeAccountId: state.activeAccountId,
      });
    },
    updateTempAccount: (state, { payload }) => {
      state.tempAccount = {...payload, ...state.tempAccount};
    },
    clearTempAccount: (state) => {
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
