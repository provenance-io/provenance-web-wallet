import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import type { AssetChart, OptionalChartDataPayload } from 'types';
import { generateStartDate } from 'utils';

/**
 * STATE
 */
const initialState: AssetChart = {
  assetName: '',
  currentAssetValue: 0,
  currentPriceChange: 0,
  currentPriceChangePercent: '',
  currentDate: '',
  timePeriod: 'HOURLY',
  startDate: generateStartDate('HOURLY'),
  endDate: '',
  values: [],
  valueDiffs: [],
  valueDiffPercents: [],
  labels: [],
};

/**
 * SLICE
 */

const assetChartSlice = createSlice({
  name: 'assetChart',
  initialState,
  reducers: {
    setAssetChartData: (
      state,
      { payload }: { payload: OptionalChartDataPayload }
    ) => {
      const {
        assetName,
        currentAssetValue,
        currentPriceChange,
        currentPriceChangePercent,
        currentDate,
        timePeriod,
        startDate,
        endDate,
        values,
        valueDiffs,
        valueDiffPercents,
        labels,
      } = payload;

      // Update whichever value(s) are passed in
      if (assetName !== undefined) state.assetName = assetName;
      if (currentAssetValue !== undefined)
        state.currentAssetValue = currentAssetValue;
      if (currentPriceChange !== undefined)
        state.currentPriceChange = currentPriceChange;
      if (currentPriceChangePercent !== undefined)
        state.currentPriceChangePercent = currentPriceChangePercent;
      if (currentDate !== undefined) state.currentDate = currentDate;
      if (timePeriod !== undefined) {
        state.timePeriod = timePeriod;
        state.startDate = generateStartDate(timePeriod);
      }
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
      if (values !== undefined) state.values = values;
      if (labels !== undefined) state.labels = labels;
      if (valueDiffs !== undefined) state.valueDiffs = valueDiffs;
      if (valueDiffPercents !== undefined)
        state.valueDiffPercents = valueDiffPercents;
    },
    clearAssetChartData: () => initialState,
  },
});

/**
 * ACTIONS
 */
export const assetChartActions = {
  ...assetChartSlice.actions,
};

/**
 * SELECTORS
 */
export const selectAssetChart = (state: RootState) => state.assetChart;

export default assetChartSlice.reducer;
