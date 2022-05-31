import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { getSavedData, addSavedData } from 'utils';
import { DEFAULT_UNLOCK_DURATION } from 'consts';
import { Settings } from 'types';

/**
 * TYPES
 */
type State = Settings;

/**
 * STATE
 */
const initialState: State = {
  unlockDuration: DEFAULT_UNLOCK_DURATION,
  unlockEST: 0,
  unlockEXP: 0,
};

/**
 * ASYNC ACTION TYPES
 */
  const PULL_INITIAL_SETTINGS_DATA = 'PULL_INITIAL_SETTINGS_DATA';
  const SAVE_SETTINGS_DATA = 'SAVE_SETTINGS_DATA';

/**
 * ASYNC ACTIONS
 */
// Pull settings data from chrome storage
 export const pullInitialSettingsData = createAsyncThunk(PULL_INITIAL_SETTINGS_DATA, async () => {
  // Pull all settings data
  const {
    unlockEST = initialState.unlockEST,
    unlockEXP = initialState.unlockEXP,
    unlockDuration = initialState.unlockDuration,
  } = await getSavedData('settings') || {};
  // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
  await addSavedData({
    settings: {
      unlockEST,
      unlockEXP,
      unlockDuration,
    }
  });
  return { unlockEST, unlockEXP, unlockDuration };
})
// Save settings data into the chrome store
export const saveSettingsData =  createAsyncThunk(SAVE_SETTINGS_DATA, async (data: Settings) => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('settings');
  const newData = { ...existingData, ...data };
  // Save to chrome storage
  await addSavedData({ settings: newData });
  // Return new combined values to update redux store
  return newData;
});

/**
 * SLICE
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(pullInitialSettingsData.fulfilled, (state, { payload }) => {
      const { unlockEST, unlockEXP, unlockDuration } = payload;
      state.unlockEST = unlockEST;
      state.unlockEXP = unlockEXP;
      state.unlockDuration = unlockDuration;
    })
    .addCase(saveSettingsData.fulfilled, (state, { payload }) => {
      const { unlockEST, unlockEXP, unlockDuration } = payload;
      if (unlockEST) state.unlockEST = unlockEST;
      if (unlockEXP) state.unlockEXP = unlockEXP;
      if (unlockDuration) state.unlockDuration = unlockDuration;
    })
  },
  reducers: {},
});

/**
 * ACTIONS
 */
export const settingsActions = { ...settingsSlice.actions, pullInitialSettingsData, saveSettingsData };

/**
 * SELECTORS
 */
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
