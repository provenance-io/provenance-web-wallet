import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Account, AccountStorage } from 'types';
import { getSavedData, addSavedData, removeSavedData } from 'utils';

/**
 * TYPES
 */
interface TempAccount extends Account {
  mnemonic?: string
}
interface ChromeInitialState {
  activeAccountId?: string;
  accounts: Account[];
}
type State = ChromeInitialState & {
  tempAccount?: TempAccount;
}
interface UpdateTempAccount {
  payload: TempAccount
}
/**
 * STATE
 */
const chromeInitialState: ChromeInitialState = {
  activeAccountId: '',
  accounts: [],
}
const initialState: State = {
  ...chromeInitialState,
  tempAccount: undefined,
};

/**
 * ASYNC ACTION TYPES
 */
const RESET_ACCOUNT_DATA = 'RESET_ACCOUNT_DATA';
const PULL_INITIAL_ACCOUNT_DATA = 'PULL_INITIAL_ACCOUNT_DATA';
const SAVE_ACCOUNT_DATA = 'SAVE_ACCOUNT_DATA';
const ADD_ACCOUNT = 'ADD_ACCOUNT';

 /**
 * ASYNC ACTIONS
 */
export const resetAccountData = createAsyncThunk(RESET_ACCOUNT_DATA, async () => {
  // Remove all existing values from chrome storage
  await removeSavedData('account');
  // Reset initial chrome state values
  return await addSavedData({ account: chromeInitialState})
});
export const pullInitialAccountData = createAsyncThunk(PULL_INITIAL_ACCOUNT_DATA, async () => {
  const {
    accounts = initialState.accounts,
    activeAccountId = initialState.activeAccountId,
  } = await getSavedData('account') || {};
  // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
  await addSavedData({
    account: {
      accounts,
      activeAccountId,
    }
  });
  return { accounts, activeAccountId };
})
// Save account data into the chrome store (will override existing values, ex accounts array)
export const saveAccountData =  createAsyncThunk(SAVE_ACCOUNT_DATA, async (data: AccountStorage) => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('account');
  // Combine existing data with new data (will overwrite existing data)
  const newData = { ...existingData, ...data };
  // Save to chrome storage
  await addSavedData({ account: newData });
  // Return new combined values to update redux store
  return newData;
});
// Add to and save account data into the chrome store (will combine data instead of overriding ex accounts array)
export const addAccount =  createAsyncThunk(ADD_ACCOUNT, async (account: Account) => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('account');
  // Get the existing accounts array
  const { accounts } = existingData;
  // Check to make sure this account doesn't already exist in the existing accounts array
  const accountAlreadyExists = accounts.find((existingAccount:Account) => account.address === existingAccount.address);
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

/**
 * SLICE
 */
const accountSlice = createSlice({
  name: 'account',
  initialState,
  extraReducers: (builder) => {
    builder
    // Reset redux store to initial values
    .addCase(resetAccountData.fulfilled, (state) => { state = initialState })
    .addCase(pullInitialAccountData.fulfilled, (state, { payload }) => {
      const { accounts, activeAccountId } = payload;
      state.accounts = accounts;
      state.activeAccountId = activeAccountId;
    })
    .addCase(addAccount.fulfilled, (state, { payload }) => {
      // We won't be adding an account if it already existed in the accounts array (see async func above)
      if (payload) {
        const { accounts, activeAccountId } = payload;
        state.accounts = accounts;
        state.activeAccountId = activeAccountId;
      }
    })
    .addCase(saveAccountData.fulfilled, (state, { payload }) => {
      const { accounts, activeAccountId } = payload;
      if (accounts) state.accounts = accounts;
      if (activeAccountId !== undefined) state.activeAccountId = activeAccountId;
    })
  },
  reducers: {
    updateTempAccount: (state, { payload }: UpdateTempAccount) => {
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
export const accountActions = {
  ...accountSlice.actions,
  pullInitialAccountData,
  saveAccountData,
  addAccount,
  resetAccountData,
};

/**
 * SELECTORS
 */
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
