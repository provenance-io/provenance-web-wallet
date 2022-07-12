import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ADDRESS_URL } from 'consts';
import { RootState } from 'redux/store';
import { api } from '../api';
import { getServiceMobileApi } from 'utils';
import { Address, Transaction } from 'types';
import { compareDesc, parseISO } from 'date-fns';

/**
 * INITIAL STATE
 */
const initialState: Address = {
  allTransactionsLoading: false,
  assetsLoading: false,
  transactionsLoading: false,

  allTransactionsPages: 0,
  allTransactionsTotalCount: 0,

  allTransactions: [],
  assets: [],
  transactions: [],

  allTransactionsError: null,
  assetsError: null,
  transactionsError: null,
};

/**
 * ACTION TYPES
 */

const GET_ADDRESS_ASSETS = 'GET_ADDRESS_ASSETS';
const GET_ADDRESS_TX = 'GET_ADDRESS_TX';
const GET_ADDRESS_TX_ALL = 'GET_ADDRESS_TX_ALL';

/**
 * SPECIAL ASYNC ACTIONS
 */
const getAddressAssetsCount = async (addr: string):Promise<number> => {
  const result = await api({
    url: `${getServiceMobileApi(addr, ADDRESS_URL)}/${addr}/assets`,
  });
  return result?.data?.length || 0;
}

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
  (addr: string) =>
    api({
      url: `${getServiceMobileApi(addr, ADDRESS_URL)}/${addr}/transactions`,
    })
);

export const getAddressTxAll = createAsyncThunk(
  GET_ADDRESS_TX_ALL,
  (addr: string) =>
    api({
      url: `${getServiceMobileApi(addr, ADDRESS_URL)}/${addr}/transactions/all`,
    })
);

export const addressActions = { getAddressAssets, getAddressTx, getAddressTxAll };

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

    // ADDRESS TRANSACTIONS
    builder
      .addCase(getAddressTx.pending, (state) => {
        state.transactionsLoading = true;
      })
      .addCase(getAddressTx.fulfilled, (state, { payload }) => {
        state.transactionsLoading = false;
        state.transactions = payload.data.sort((a: Transaction, b: Transaction) =>
          compareDesc(parseISO(a.timestamp), parseISO(b.timestamp))
        );
      })
      .addCase(getAddressTx.rejected, (state, { payload }) => {
        state.transactionsLoading = false;
        state.transactions = [];
        state.transactionsError = payload;
      });

    // ADDRESS TRANSACTIONS ALL
    builder
      .addCase(getAddressTxAll.pending, (state) => {
        state.allTransactionsLoading = true;
      })
      .addCase(getAddressTxAll.fulfilled, (state, { payload }) => {
        state.allTransactionsLoading = false;
        state.allTransactions = payload.data.transactions;
        state.allTransactionsPages = payload.data.pages;
        state.allTransactionsTotalCount = payload.data.totalCount;
      })
      .addCase(getAddressTxAll.rejected, (state, { payload }) => {
        state.allTransactionsLoading = false;
        state.allTransactions = [];
        state.allTransactionsPages = 0;
        state.allTransactionsTotalCount = 0;
        state.allTransactionsError = payload;
      });
  },
});

export default addressSlice.reducer;

/**
 * SELECTORS
 */
export const selectAddress = (state: RootState) => state.api_address;
