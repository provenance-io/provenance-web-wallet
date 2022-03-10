import { createSlice } from '@reduxjs/toolkit';
import { generateMnemonic as bip39gm } from 'bip39';
import { RootState } from 'redux/store';

/**
 * TYPES
 */
export interface GenericState {
  mnemonic: string | undefined;
}

/**
 * STATE
 */
const initialState: GenericState = {
  mnemonic: undefined,
};

/**
 * SLICE
 */
const genericSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    generateMnemonic: (state) => {
      state.mnemonic = bip39gm(256);
    },
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
