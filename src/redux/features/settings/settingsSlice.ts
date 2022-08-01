import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { getSavedData, addSavedData, removeSavedData } from 'utils';
import { DEFAULT_UNLOCK_DURATION } from 'consts';
import { SettingsState, SettingsStorage } from 'types';

/**
 * TYPES
 */
type State = SettingsState;

/**
 * STATE
 */
const initialState: State = {
  unlockDuration: DEFAULT_UNLOCK_DURATION,
  unlockEST: 0,
  unlockEXP: 0,
  initialDataPulled: false,
  initialAppLoad: true,
};

/**
 * ASYNC ACTION TYPES
 */
const PULL_INITIAL_SETTINGS_DATA = 'PULL_INITIAL_SETTINGS_DATA';
const SAVE_SETTINGS_DATA = 'SAVE_SETTINGS_DATA';
const RESET_SETTINGS_DATA = 'RESET_SETTINGS_DATA';
const BUMP_UNLOCK_DURATION = 'BUMP_UNLOCK_DURATION';

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
      unlockEST = initialState.unlockEST,
      unlockEXP = initialState.unlockEXP,
      unlockDuration = initialState.unlockDuration,
    } = (await getSavedData('settings')) || {};
    // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
    await addSavedData({
      settings: {
        unlockEST,
        unlockEXP,
        unlockDuration,
      },
    });
    return { unlockEST, unlockEXP, unlockDuration };
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
        const { unlockEST, unlockEXP, unlockDuration } = payload;
        state.unlockEST = unlockEST;
        state.unlockEXP = unlockEXP;
        state.unlockDuration = unlockDuration;
        state.initialDataPulled = true;
      })
      .addCase(saveSettingsData.fulfilled, (state, { payload }) => {
        const { unlockEST, unlockEXP, unlockDuration } = payload;
        if (unlockEST) state.unlockEST = unlockEST;
        if (unlockEXP) state.unlockEXP = unlockEXP;
        if (unlockDuration) state.unlockDuration = unlockDuration;
      })
      .addCase(bumpUnlockDuration.fulfilled, (state, { payload }) => {
        const { unlockEST, unlockEXP } = payload;
        state.unlockEST = unlockEST;
        state.unlockEXP = unlockEXP;
      });
  },
  reducers: {
    setInitialAppLoad: (state, { payload }: { payload: boolean }) => {
      state.initialAppLoad = payload;
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
};

/**
 * SELECTORS
 */
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
