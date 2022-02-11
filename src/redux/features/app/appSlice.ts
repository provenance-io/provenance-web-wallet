import { createSlice } from '@reduxjs/toolkit';
import { generateMnemonic as bip39gm } from 'bip39';

interface AppState {
  mnemonic: string | undefined;
}

const initialState: AppState = {
  mnemonic: undefined,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    generateMnemonic: (state) => {
      state.mnemonic = bip39gm(256);
    },
  },
});

export const { generateMnemonic } = appSlice.actions;
export default appSlice.reducer;
