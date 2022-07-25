import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ADDRESS_URL } from 'consts';
import { RootState } from 'redux/store';
import { api } from '../api';
import { getServiceMobileApi } from 'utils';
import { Address } from 'types';

/**
 * INITIAL STATE
 */
const initialState: Address = {
  transactionsTotalCount: 0,
  transactionsPages: 0,
  transactions: [],
  transactionsLoading: false,
  transactionsError: false,

  assetsLoading: false,
  assetsError: null,
  assets: [],
};

/**
 * ACTION TYPES
 */

const GET_ADDRESS_ASSETS = 'GET_ADDRESS_ASSETS';
const GET_ADDRESS_TX = 'GET_ADDRESS_TX';

/**
 * SPECIAL ASYNC ACTIONS
 */
const getAddressAssetsCount = async (addr: string): Promise<number> => {
  const result = await api({
    url: `${getServiceMobileApi(addr, ADDRESS_URL)}/${addr}/assets`,
  });
  return result?.data?.length || 0;
};

/**
 * ASYNC ACTIONS
 */
export const getAddressAssets = createAsyncThunk(
  GET_ADDRESS_ASSETS,
  (addr: string) =>
    api({
      url: `${getServiceMobileApi(addr, ADDRESS_URL)}/${addr}/assets`,
    })
);

export const getAddressTx = createAsyncThunk(
  GET_ADDRESS_TX,
  (params: { address: string; page?: number; count?: number }) => {
    const { address, page, count } = params;
    const urlObj = new URL(
      `${getServiceMobileApi(address, ADDRESS_URL)}/${address}/transactions/all`
    );
    const searchParamsObj = new URLSearchParams();
    if (page) searchParamsObj.append('page', `${page}`);
    if (count) searchParamsObj.append('count', `${count}`);
    urlObj.search = searchParamsObj.toString();
    const url = urlObj.toString();
    return api({ url });
  }
);

export const addressActions = { getAddressAssets, getAddressTx };

export const noDispatchActions = {
  getAddressAssetsCount,
};

/**
 * SLICE
 */
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ADDRESS ASSETS
    builder
      .addCase(getAddressAssets.pending, (state) => {
        state.assetsLoading = true;
      })
      .addCase(getAddressAssets.fulfilled, (state, { payload }) => {
        state.assetsLoading = false;
        state.assets = payload.data;
      })
      .addCase(getAddressAssets.rejected, (state, { payload }) => {
        state.assetsLoading = false;
        state.assets = [];
        state.assetsError = payload;
      });
    // ADDRESS TRANSACTIONS ALL
    builder
      .addCase(getAddressTx.pending, (state) => {
        state.transactionsLoading = true;
      })
      .addCase(getAddressTx.fulfilled, (state, { payload }) => {
        state.transactionsLoading = false;
        state.transactions = payload.data.transactions;
        state.transactionsPages = payload.data.pages;
        state.transactionsTotalCount = payload.data.totalCount;
      })
      .addCase(getAddressTx.rejected, (state) => {
        state.transactionsLoading = initialState.transactionsLoading;
        state.transactions = initialState.transactions;
        state.transactionsPages = initialState.transactionsPages;
        state.transactionsTotalCount = initialState.transactionsTotalCount;
        state.transactionsError = initialState.transactionsError;
      });
  },
});

export default addressSlice.reducer;

/**
 * SELECTORS
 */
export const selectAddress = (state: RootState) => state.api_address;
