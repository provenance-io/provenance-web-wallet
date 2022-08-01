import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SMW_MAINNET, SMW_STATS_URL } from 'consts';
import { RootState } from 'redux/store';
import { api } from '../api';
import { Statistics } from 'types';

/**
 * INITIAL STATE
 */

interface InitialState {
  statisticsError: any;
  statisticsLoading: boolean;
  statistics: Statistics;
}

const initialState: InitialState = {
  statisticsError: null,
  statisticsLoading: false,
  statistics: {
    averageBlockTime: 0,
    marketCap: 0,
    transactions: 0,
    validators: 0,
  },
};

const productionStatsApiUrl = `${SMW_MAINNET}/${SMW_STATS_URL}`;

/**
 * ACTION TYPES
 */

const GET_STATISTICS = 'GET_STATISTICS';

/**
 * ASYNC ACTIONS
 */

const getStatistics = createAsyncThunk(GET_STATISTICS, () =>
  api({ url: productionStatsApiUrl })
);

export const statisticsActions = { getStatistics };

/**
 * SLICE
 */
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(getStatistics.fulfilled, (state, { payload }) => {
        state.statisticsLoading = false;
        state.statistics = payload.data;
      })
      .addCase(getStatistics.rejected, (state, { payload }) => {
        state.statisticsLoading = false;
        state.statisticsError = payload;
      });
  },
});

export default statisticsSlice.reducer;

/**
 * SELECTORS
 */

export const selectStatistics = (state: RootState) => state.api_statistics;
