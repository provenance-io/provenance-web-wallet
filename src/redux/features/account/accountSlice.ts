import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import type { Account, AccountStorage } from 'types';
import { getSavedData, addSavedData, removeSavedData } from 'utils';

/**
 * TYPES
 */
interface TempAccount extends Account {
  mnemonic?: string;
  parentMasterKey?: string;
  parentHdPath?: string;
}
interface ChromeInitialState {
  activeAccountId?: string;
  accounts: Account[];
}
type State = ChromeInitialState & {
  tempAccount?: TempAccount;
  initialDataPulled: boolean;
};
interface UpdateTempAccount {
  payload: TempAccount;
}
/**
 * STATE
 */
const chromeInitialState: ChromeInitialState = {
  activeAccountId: '',
  accounts: [],
};
const initialState: State = {
  ...chromeInitialState,
  tempAccount: undefined,
  initialDataPulled: false,
};

/**
 * ASYNC ACTION TYPES
 */
const RESET_ACCOUNT_DATA = 'RESET_ACCOUNT_DATA';
const PULL_INITIAL_ACCOUNT_DATA = 'PULL_INITIAL_ACCOUNT_DATA';
const SAVE_ACCOUNT_DATA = 'SAVE_ACCOUNT_DATA';
const SET_ACTIVE_ACCOUNT = 'SET_ACTIVE_ACCOUNT';
const ADD_ACCOUNT = 'ADD_ACCOUNT';
const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';
const RENAME_ACCOUNT = 'RENAME_ACCOUNT';

/**
 * ASYNC ACTIONS
 */
export const resetAccountData = createAsyncThunk(RESET_ACCOUNT_DATA, async () => {
  // Remove all existing values from chrome storage
  await removeSavedData('account');
  // Reset initial chrome state values
  return await addSavedData({ account: chromeInitialState });
});
export const pullInitialAccountData = createAsyncThunk(
  PULL_INITIAL_ACCOUNT_DATA,
  async () => {
    const {
      accounts = initialState.accounts,
      activeAccountId = initialState.activeAccountId,
    } = (await getSavedData('account')) || {};
    // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
    await addSavedData({
      account: {
        accounts,
        activeAccountId,
      },
    });
    return { accounts, activeAccountId };
  }
);
// Save account data into the chrome store (will override existing values, ex accounts array)
export const saveAccountData = createAsyncThunk(
  SAVE_ACCOUNT_DATA,
  async (data: AccountStorage) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('account');
    // Combine existing data with new data (will overwrite existing data)
    const newData = { ...existingData, ...data };
    // Save to chrome storage
    await addSavedData({ account: newData });
    // Return new combined values to update redux store
    return newData;
  }
);
// Set/Save a new active account
export const setActiveAccount = createAsyncThunk(
  SET_ACTIVE_ACCOUNT,
  async (activeAccountId: string) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('account');
    // Combine existing data with new data (will overwrite existing data)
    const newData = { ...existingData, activeAccountId };
    // Save to chrome storage
    await addSavedData({ account: newData });
    // Return new combined values to update redux store
    return activeAccountId;
  }
);
// Add to and save account data into the chrome store (will combine data instead of overriding ex accounts array)
export const addAccount = createAsyncThunk(ADD_ACCOUNT, async (account: Account) => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('account');
  // Get the existing accounts array
  const { accounts } = existingData;
  // Check to make sure this account doesn't already exist in the existing accounts array
  const accountAlreadyExists = accounts.find(
    (existingAccount: Account) => account.address === existingAccount.address
  );
  // We want to merge the newly passed accounts with the existing accounts (both arrays)
  if (!accountAlreadyExists) {
    accounts.push(account);
    const newAccountData = { accounts, activeAccountId: account.address };
    // Save to chrome storage
    await addSavedData({ account: newAccountData });
    // Return new combined values to update redux store
    return newAccountData;
  }
  return '';
});
// Add to and save account data into the chrome store (will combine data instead of overriding ex accounts array)
export const removeAccount = createAsyncThunk(
  REMOVE_ACCOUNT,
  async (address: string) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('account');
    // Get the existing accounts array
    const { accounts, activeAccountId } = existingData;
    // Filter to only keep accounts without this address
    const newAccounts = accounts.filter(
      (existingAccount: Account) => existingAccount.address !== address
    );
    // If removed account was active, set first account in accounts list as active
    const newActiveAccountId =
      activeAccountId === address ? newAccounts[0].address : activeAccountId;
    // Combine to update account data
    const newAccountData = {
      accounts: newAccounts,
      activeAccountId: newActiveAccountId,
    };
    // Save to chrome storage
    await addSavedData({ account: newAccountData });
    // Return new combined values to update redux store
    return newAccountData;
  }
);
// Rename an account and readd to all data storage locations
export const renameAccount = createAsyncThunk(
  RENAME_ACCOUNT,
  async (payload: { address: string; name: string }) => {
    const { address, name } = payload;
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('account');
    // Get the existing accounts array
    const { accounts, activeAccountId } = existingData;
    // Find target account
    const targetAccount: Account = accounts.find(
      (existingAccount: Account) => existingAccount.address === address
    );
    // All other accounts
    const otherAccounts: Account[] = accounts.filter(
      (existingAccount: Account) => existingAccount.address !== address
    );
    // Clone the targetAccount to change name value
    const updatedAccount = { ...targetAccount };
    updatedAccount.name = name;
    // Re-Add updatedAccount to all accounts
    const newAccounts = [...otherAccounts, updatedAccount];
    // Combine to update account data
    const newAccountData = { accounts: newAccounts, activeAccountId };
    // Save to chrome storage
    await addSavedData({ account: newAccountData });
    // Return new combined values to update redux store
    return newAccountData;
  }
);

/**
 * SLICE
 */
const accountSlice = createSlice({
  name: 'account',
  initialState,
  extraReducers: (builder) => {
    builder
      // Reset redux store to initial values
      .addCase(resetAccountData.fulfilled, () => initialState)
      .addCase(pullInitialAccountData.fulfilled, (state, { payload }) => {
        const { accounts, activeAccountId } = payload;
        state.accounts = accounts;
        state.activeAccountId = activeAccountId;
        state.initialDataPulled = true;
      })
      .addCase(addAccount.fulfilled, (state, { payload }) => {
        // We won't be adding an account if it already existed in the accounts array (see async func above)
        if (payload) {
          const { accounts, activeAccountId } = payload;
          state.accounts = accounts;
          state.activeAccountId = activeAccountId;
        }
      })
      .addCase(removeAccount.fulfilled, (state, { payload }) => {
        // We won't be adding an account if it already existed in the accounts array (see async func above)
        if (payload) {
          const { accounts, activeAccountId } = payload;
          state.accounts = accounts;
          state.activeAccountId = activeAccountId;
        }
      })
      .addCase(renameAccount.fulfilled, (state, { payload }) => {
        if (payload) {
          const { accounts } = payload;
          state.accounts = accounts;
        }
      })
      .addCase(saveAccountData.fulfilled, (state, { payload }) => {
        const { accounts, activeAccountId } = payload;
        if (accounts) state.accounts = accounts;
        if (activeAccountId !== undefined) state.activeAccountId = activeAccountId;
      })
      .addCase(setActiveAccount.fulfilled, (state, { payload }) => {
        state.activeAccountId = payload;
      });
  },
  reducers: {
    updateTempAccount: (state, { payload }: UpdateTempAccount) => {
      state.tempAccount = { ...state.tempAccount, ...payload };
    },
    clearTempAccount: (state) => {
      state.tempAccount = undefined;
    },
  },
});

/**
 * ACTIONS
 */
export const accountActions = {
  ...accountSlice.actions,
  pullInitialAccountData,
  saveAccountData,
  setActiveAccount,
  addAccount,
  removeAccount,
  renameAccount,
  resetAccountData,
};

/**
 * SELECTORS
 */
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
