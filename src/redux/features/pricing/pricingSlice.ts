import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import qs from 'query-string';
import { PRICING_API_URL } from 'consts';
import { RootState } from 'redux/store';
import { api } from '../api';
import { getServicePricingEngineApi } from 'utils';
import { Account } from 'types';

/**
 * INITIAL STATE
 */

interface InitialState {
  denomPrices: {
    [key: string]: Array<{
      price: number;
      timestamp: string;
    }>;
  };
  denomPriceLoading: boolean;
  denomPricesError: any;
  gasPriceError: any;
  gasPriceLoading: boolean;
  priceEngineError: any;
  priceEngineLoading: boolean;
  priceEnginePrices: {
    [key: string]: {
      id: string;
      markerAddress: string;
      markerDenom: string;
      scopeAddress: string;
      scopeUuid: string;
      priceTimestamp: string;
      usdPrice: number;
    };
  };
  gasPrice: number;
  gasPriceDenom: string;
}

const initialState: InitialState = {
  denomPriceLoading: false,
  denomPrices: {},
  denomPricesError: null,
  gasPrice: 0,
  gasPriceDenom: '',
  gasPriceError: null,
  gasPriceLoading: false,
  priceEngineError: null,
  priceEngineLoading: false,
  priceEnginePrices: {},
};

/**
 * ACTION TYPES
 */
export const GET_GAS_PRICE = 'GET_GAS_PRICE';
export const GET_DENOM_PRICE = 'GET_DENOM_PRICE';
export const QUERY_PRICING_ENGINE = 'QUERY_PRICING_ENGINE';

/**
 * ASYNC ACTIONS
 */
interface GetDenomPriceArgs {
  denom: string;
  endDate?: string;
  period?: string;
  startDate?: string;
}
type QueryPriceEngineArgs = {
  denom: string[];
};

export const getDenomPrice = createAsyncThunk(
  GET_DENOM_PRICE,
  ({ denom, period, startDate, endDate }: GetDenomPriceArgs) =>
    api({
      url: `${PRICING_API_URL}/marker/${denom}?${qs.stringify({
        period,
        startDate,
        endDate,
      })}`,
    })
);

export const getGasPrice = createAsyncThunk(GET_GAS_PRICE, () =>
  api({
    url: `${PRICING_API_URL}/gas-price`,
  })
);

export const queryPricingEngine = createAsyncThunk(
  QUERY_PRICING_ENGINE,
  ({ denom }: QueryPriceEngineArgs, { getState }) => {
    const {
      account: { accounts: allAccounts, activeAccountId },
    } = getState() as RootState;
    const { address = '' } = allAccounts.filter(
      ({ address }: Account) => activeAccountId === address
    )[0];

    return api({
      url: getServicePricingEngineApi(
        address,
        `/pricing/marker/denom/list?${qs.stringify(
          { denom },
          { arrayFormat: 'bracket-separator', arrayFormatSeparator: ',' }
        )}`
      ),
    });
  }
);

export const pricingActions = { getDenomPrice, getGasPrice, queryPricingEngine };


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
    // QUERY_PRICING_ENGINE
    builder
      .addCase(queryPricingEngine.pending, (state) => {
        state.priceEngineLoading = true;
      })
      .addCase(queryPricingEngine.fulfilled, (state, { payload }) => {
        state.priceEngineLoading = false;
        state.priceEnginePrices = payload.data.reduce(
          (prices: InitialState['priceEnginePrices'], curr: any) => {
            prices[curr.markerDenom] = curr;
            return prices;
          },
          state.priceEnginePrices
        );
      })
      .addCase(queryPricingEngine.rejected, (state, { payload }) => {
        state.priceEngineLoading = false;
        state.priceEnginePrices = {};
        state.priceEngineError = payload;
      });
  },
});

export default pricingSlice.reducer;

/**
 * SELECTORS
 */

export const selectPricing = (state: RootState) => state.api_pricing;
