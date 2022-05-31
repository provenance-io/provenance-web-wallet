import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import qs from 'query-string';
import { PRICING_URL } from 'consts';
import { RootState } from 'redux/store';
import { api } from '../api';

/**
 * INITIAL STATE
 */

interface InitialState {
  denomPriceLoading: boolean;
  gasPriceLoading: boolean;

  denomPricesError: any;
  gasPriceError: any;

  denomPrices: {
    [key: string]: Array<{
      price: number;
      timestamp: string;
    }>;
  };

  gasPrice: number;
  gasPriceDenom: string;
}

const initialState: InitialState = {
  denomPriceLoading: false,
  gasPriceLoading: false,

  denomPricesError: null,
  gasPriceError: null,

  denomPrices: {},

  gasPrice: 0,
  gasPriceDenom: '',
};

/**
 * ACTION TYPES
 */
export const GET_GAS_PRICE = 'GET_GAS_PRICE';
export const GET_DENOM_PRICE = 'GET_DENOM_PRICE';

/**
 * ASYNC ACTIONS
 */
interface GetDenomPriceArgs {
  denom: string;
  endDate: string;
  period: string;
  startDate: string;
}

export const getDenomPrice = createAsyncThunk(
  GET_DENOM_PRICE,
  ({ denom, period, startDate, endDate }: GetDenomPriceArgs) =>
    api({
      url: `${PRICING_URL}/marker/${denom}?${qs.stringify({
        period,
        startDate,
        endDate,
      })}`,
    })
);

export const getGasPrice = createAsyncThunk(GET_GAS_PRICE, () =>
  api({
    url: `${PRICING_URL}/gas-price`,
  })
);

export const pricingActions = { getDenomPrice, getGasPrice };

/**
 * SLICE
 */
const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // DENOM_PRICE
    builder
      .addCase(getDenomPrice.pending, (state) => {
        state.denomPriceLoading = true;
      })
      .addCase(getDenomPrice.fulfilled, (state, { payload, meta }) => {
        state.denomPriceLoading = false;
        state.denomPrices[meta.arg.denom] = payload.data;
      })
      .addCase(getDenomPrice.rejected, (state, { payload, meta }) => {
        state.denomPriceLoading = false;
        state.denomPrices[meta.arg.denom] = [];
        state.denomPricesError = payload;
      });

    // GAS_PRICE
    builder
      .addCase(getGasPrice.pending, (state) => {
        state.gasPriceLoading = true;
      })
      .addCase(getGasPrice.fulfilled, (state, { payload }) => {
        state.gasPriceLoading = false;
        state.gasPrice = payload.data.gasPrice;
        state.gasPriceDenom = payload.data.gasPriceDenom;
      })
      .addCase(getGasPrice.rejected, (state, { payload }) => {
        state.gasPriceLoading = false;
        state.gasPrice = 0;
        state.gasPriceDenom = '';
        state.gasPriceError = payload;
      });
  },
});

export default pricingSlice.reducer;

/**
 * SELECTORS
 */

export const selectPricing = (state: RootState) => state.api_pricing;
