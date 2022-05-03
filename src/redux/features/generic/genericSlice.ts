import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { createMnemonic } from 'utils';

/**
 * TYPES
 */
export interface GenericState {
  mnemonic?: string;
  name?: string
}

/**
 * STATE
 */
const initialState: GenericState = {
  mnemonic: undefined,
  name: undefined,
};

/**
 * SLICE
 */
const genericSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    generateMnemonic: (state) => {
      state.mnemonic = createMnemonic();
    },
    setAccountName: (state, action) => {
      state.name = action.payload;
    }
  },
});

/**
 * ACTIONS
 */
export const genericActions = genericSlice.actions;

/**
 * SELECTORS
 */
export const selectGeneric = (state: RootState) => state.generic;

export default genericSlice.reducer;
