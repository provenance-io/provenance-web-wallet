import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { getSavedData, addSavedData, removeSavedData } from 'utils';
import { DEFAULT_UNLOCK_DURATION } from 'consts';
import type { SettingsState, SettingsStorage } from 'types';

/**
 * TYPES
 */
type State = SettingsState;

/**
 * STATE
 */
const initialState: State = {
  eolSeen: false,
  unlockDuration: DEFAULT_UNLOCK_DURATION,
  unlockEST: 0,
  unlockEXP: 0,
  locked: true,
  initialDataPulled: false,
  initialAppLoad: true,
  customGRPCApi: '',
};

/**
 * ASYNC ACTION TYPES
 */
const PULL_INITIAL_SETTINGS_DATA = 'PULL_INITIAL_SETTINGS_DATA';
const SAVE_SETTINGS_DATA = 'SAVE_SETTINGS_DATA';
const RESET_SETTINGS_DATA = 'RESET_SETTINGS_DATA';
const BUMP_UNLOCK_DURATION = 'BUMP_UNLOCK_DURATION';
const LOCK_WALLET = 'LOCK_WALLET';
const SET_UNLOCK_DURATION = 'SET_UNLOCK_DURATION';

/**
 * ASYNC ACTIONS
 */
// Remove all existing values from chrome storage
export const resetSettingsData = createAsyncThunk(RESET_SETTINGS_DATA, async () => {
  // Remove all existing values from chrome storage
  await removeSavedData('settings');
  // Reset initial chrome state values
  return await addSavedData({ settings: initialState });
});
// Pull settings data from chrome storage
export const pullInitialSettingsData = createAsyncThunk(
  PULL_INITIAL_SETTINGS_DATA,
  async () => {
    // Pull all settings data
    const {
      eolSeen = initialState.eolSeen,
      unlockEST = initialState.unlockEST,
      unlockEXP = initialState.unlockEXP,
      unlockDuration = initialState.unlockDuration,
      customGRPCApi = initialState.customGRPCApi,
    } = (await getSavedData('settings')) || {};
    // Update locked value based on saved data
    // Current time
    const now = Date.now();
    // Check the unlockSession
    const locked = !unlockEST || !unlockEXP || now > unlockEXP;
    // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
    await addSavedData({
      settings: {
        eolSeen,
        unlockEST,
        unlockEXP,
        unlockDuration,
        customGRPCApi,
      },
    });
    return { eolSeen, unlockEST, unlockEXP, unlockDuration, customGRPCApi, locked };
  }
);
// Save settings data into the chrome store
export const saveSettingsData = createAsyncThunk(
  SAVE_SETTINGS_DATA,
  async (data: SettingsStorage) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('settings');
    const newData = { ...existingData, ...data };
    // Save to chrome storage
    await addSavedData({ settings: newData });
    // Return new combined values to update redux store
    return newData;
  }
);
// Bump the unlock duration due to an action
export const bumpUnlockDuration = createAsyncThunk(
  BUMP_UNLOCK_DURATION,
  async () => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('settings');
    // Get existing unlock duration
    const { unlockDuration } = existingData;
    // Current time
    const now = Date.now();
    // Determine when the unlock will expire (note: -1 means never)
    const unlockEXP = unlockDuration === -1 ? -1 : now + unlockDuration!;
    const unlockEST = now;
    // Save updated unlock data (and add back all other existing data)
    const newData = { ...existingData, unlockEST, unlockEXP };
    await addSavedData({ settings: newData });
    return { unlockEST, unlockEXP };
  }
);
// Lock the wallet
export const lockWallet = createAsyncThunk(LOCK_WALLET, async () => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('settings');
  const unlockEST = initialState.unlockEST;
  const unlockEXP = initialState.unlockEXP;
  const locked = true;
  // Save updated unlock data (and add back all other existing data)
  const newData = { ...existingData, unlockEST, unlockEXP };
  await addSavedData({ settings: newData });
  return { unlockEST, unlockEXP, locked };
});
// Change lock timeout duration
export const setUnlockDuration = createAsyncThunk(
  SET_UNLOCK_DURATION,
  async (unlockDuration: number) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('settings');
    // Save updated unlock data (and add back all other existing data)
    const newData = { ...existingData, unlockDuration };
    await addSavedData({ settings: newData });
    return { unlockDuration };
  }
);

/**
 * SLICE
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  extraReducers: (builder) => {
    builder
      // Reset redux store to initial values
      .addCase(resetSettingsData.fulfilled, () => initialState)
      .addCase(pullInitialSettingsData.fulfilled, (state, { payload }) => {
        const {
          eolSeen,
          unlockEST,
          unlockEXP,
          unlockDuration,
          customGRPCApi,
          locked,
        } = payload;
        state.eolSeen = eolSeen;
        state.unlockEST = unlockEST;
        state.unlockEXP = unlockEXP;
        state.unlockDuration = unlockDuration;
        state.initialDataPulled = true;
        state.customGRPCApi = customGRPCApi;
        state.locked = locked;
      })
      .addCase(saveSettingsData.fulfilled, (state, { payload }) => {
        const { eolSeen, unlockEST, unlockEXP, unlockDuration, customGRPCApi } =
          payload;
        if (eolSeen) state.eolSeen = eolSeen;
        if (unlockEST) state.unlockEST = unlockEST;
        if (unlockEXP) state.unlockEXP = unlockEXP;
        if (unlockDuration) state.unlockDuration = unlockDuration;
        if (customGRPCApi !== undefined) state.customGRPCApi = customGRPCApi;
      })
      .addCase(bumpUnlockDuration.fulfilled, (state, { payload }) => {
        const { unlockEST, unlockEXP } = payload;
        state.unlockEST = unlockEST;
        state.unlockEXP = unlockEXP;
        state.locked = false;
      })
      .addCase(lockWallet.fulfilled, (state, { payload }) => {
        const { unlockEST, unlockEXP, locked } = payload;
        state.unlockEST = unlockEST;
        state.unlockEXP = unlockEXP;
        state.locked = locked;
      })
      .addCase(setUnlockDuration.fulfilled, (state, { payload }) => {
        const { unlockDuration } = payload;
        state.unlockDuration = unlockDuration;
      });
  },
  reducers: {
    setInitialAppLoad: (state, { payload }: { payload: boolean }) => {
      state.initialAppLoad = payload;
    },
    setWalletLockedValue: (state, { payload }: { payload: boolean }) => {
      state.locked = payload;
    },
  },
});

/**
 * ACTIONS
 */
export const settingsActions = {
  ...settingsSlice.actions,
  pullInitialSettingsData,
  saveSettingsData,
  resetSettingsData,
  bumpUnlockDuration,
  lockWallet,
  setUnlockDuration,
};

/**
 * SELECTORS
 */
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
