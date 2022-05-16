import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Account } from 'types';

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
  initialLoad: boolean;
}
interface AddAccounts {
  payload: {
    accounts: Account[] | Account,
    activeAccountId?: number
  }
}
interface SetInitialValues {
  payload: {
    accounts?: Account[],
    activeAccountId?: number,
  }
}
interface SetActiveAccountId {
  payload: number
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
  initialLoad: true,
};

/**
 * SLICE
 */
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setInitialValues: (state, { payload }: SetInitialValues) => {
      const { accounts, activeAccountId } = payload
      if (accounts && accounts.length) {
        state.accounts = accounts;
        // Either use the passed in payload, or get one from the passed in accounts
        state.activeAccountId = activeAccountId || accounts[0].id;
      }
      state.initialLoad = false;
    },
    // Add 1 or more accounts
    addAccounts: (state, { payload }: AddAccounts ) => {
      const { accounts, activeAccountId } = payload;
      // Make sure accounts passed in is an array
      const accountsArray = Array.isArray(accounts) ? accounts : [accounts];
      state.accounts.push(...accountsArray);
      // Either use the passed in payload, or get one from the passed in accounts
      state.activeAccountId = activeAccountId || accountsArray[0].id;
    },
    setActiveAccountId: (state, { payload }: SetActiveAccountId) => {
      state.activeAccountId = payload;
    },
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
export const accountActions = accountSlice.actions;

/**
 * SELECTORS
 */
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
