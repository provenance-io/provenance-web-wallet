import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Account, AccountStorage } from 'types';
import { getSavedData, addSavedData } from 'utils';

/**
 * TYPES
 */
interface TempAccount extends Account {
  mnemonic?: string
}
interface State {
  activeAccountId?: number;
  accounts: Account[];
  tempAccount?: TempAccount;
  key: string,
}
interface UpdateTempAccount {
  payload: TempAccount
}
/**
 * STATE
 */
const initialState: State = {
  activeAccountId: -1,
  accounts: [],
  tempAccount: undefined,
  key: '',
};

/**
 * ASYNC ACTION TYPES
 */
  const PULL_INITIAL_ACCOUNT_DATA = 'PULL_INITIAL_ACCOUNT_DATA';
  const SAVE_ACCOUNT_DATA = 'SAVE_ACCOUNT_DATA';
  const ADD_ACCOUNT = 'ADD_ACCOUNT';

 /**
 * ASYNC ACTIONS
 */
export const pullInitialAccountData = createAsyncThunk(PULL_INITIAL_ACCOUNT_DATA, async () => {
  const {
    accounts = initialState.accounts,
    activeAccountId = initialState.activeAccountId,
    key = initialState.key,
  } = await getSavedData('account') || {};
  // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
  await addSavedData({
    account: {
      accounts,
      activeAccountId,
      key,
    }
  });
  return { accounts, activeAccountId, key };
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
  const accountAlreadyExists = accounts.filter(({ id }:Account) => account.id === id).length;
  // We want to merge the newly passed accounts with the existing accounts (both arrays)
  if (!accountAlreadyExists) {
    accounts.push(account);
    const newAccountData = { ...existingData, accounts };
    // Save to chrome storage
    await addSavedData({ account: newAccountData });
    // Return new combined values to update redux store
    return accounts;
  }
  return '';
});
// TODO: Might need to start storing keys in an array with ids, then each account will reference a keyId when locking/unlocking

/**
 * SLICE
 */
const accountSlice = createSlice({
  name: 'account',
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(pullInitialAccountData.fulfilled, (state, { payload }) => {
      const { accounts, activeAccountId, key } = payload;
      state.accounts = accounts;
      state.activeAccountId = activeAccountId;
      state.key = key;
    })
    .addCase(addAccount.fulfilled, (state, { payload: accounts }) => {
      // We won't be adding an account if it already existed in the accounts array (see async func above)
      if (accounts) {
        state.accounts = accounts;
      }
    })
    .addCase(saveAccountData.fulfilled, (state, { payload }) => {
      const { accounts, activeAccountId, key } = payload;
      if (accounts) state.accounts = accounts;
      if (activeAccountId !== undefined) state.activeAccountId = activeAccountId;
      if (key) state.key = key;
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
export const accountActions = { ...accountSlice.actions, pullInitialAccountData, saveAccountData, addAccount };

/**
 * SELECTORS
 */
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
