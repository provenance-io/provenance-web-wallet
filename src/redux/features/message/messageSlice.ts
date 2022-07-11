import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { Message as MessageSlice } from 'types';
import { Message as MessageProto } from 'google-protobuf';
import {
  buildCalculateTxFeeRequest,
  calculateTxFees,
  buildMessage,
  createAnyMessageBase64,
  getAccountInfo,
  msgAnyB64toAny,
  // MsgSendDisplay,
} from '@provenanceio/wallet-utils';
import { convertUtf8ToBuffer } from '@walletconnect/utils';
import { getGrpcApi } from 'utils';

const initialState: MessageSlice = {
  coinAmount: undefined,
  coin: undefined,
  txBaseAccount: '',
  txSendAddress: '',
  txFromAddress: '',
  txMemo: undefined,
  txFeeEstimate: 0,
  txFeeDenom: 'nhash',
  txGasPrice: 19050, // TODO: Dynamically get gas price
  txGasPriceAdjustment: 1.25, // TODO: Dynamically get gas price adjustment
  txGasPriceDenom: 'nhash',
  txGasEstimate: 0,
  txGasAdjustment: 0,
  txType: 'MsgSend', // TODO: Make Dynamic
};

interface GetTxFeeEstimateResponse {
  txFeeEstimate: number,
  txGasEstimate: number,
}

// Actions
const GET_TX_FEE_ESTIMATE = 'GET_TX_FEE_ESTIMATE';

// Remove all existing values from chrome storage
export const getTxFeeEstimate = createAsyncThunk<GetTxFeeEstimateResponse, string, {state: RootState }>(
  GET_TX_FEE_ESTIMATE,
  async (publicKey, { getState }) => {
    console.log('messageSlice.ts | getTxFeeEstimate(): publicKey', publicKey);
    const { message } = getState();
    const {
      coin,
      coinAmount,
      txSendAddress,
      txFromAddress,
      txType,
      txGasPriceDenom,
      txGasPrice,
      txGasAdjustment,
    } = message;
    console.log('message: ', message);
    // Required values must exist to get fee estimate
    const requiredValuesExist =
      txType !== undefined &&
      !!txFromAddress &&
      !!txSendAddress &&
      !!publicKey &&
      coin !== undefined &&
      coin.denom !== undefined &&
      coinAmount !== undefined;

    console.log('requiredValuesExist :', requiredValuesExist);
    if (requiredValuesExist) {
      const sendMessage = {
        amountList: [{ denom: coin!.denom, amount: coinAmount!}],
        fromAddress: txFromAddress!,
        toAddress: txSendAddress!,
      };
      const messageMsgSend = buildMessage(txType!, sendMessage);
      const messageB64String = createAnyMessageBase64(txType!, messageMsgSend as MessageProto);
      const msgAny = msgAnyB64toAny(messageB64String);
      const grpcAddress = getGrpcApi(txFromAddress!);
      const { baseAccount } = await getAccountInfo(txFromAddress!, grpcAddress);
      const calculateTxFeeRequest = buildCalculateTxFeeRequest({
        msgAny,
        account: baseAccount,
        publicKey: convertUtf8ToBuffer(publicKey), 
        gasPriceDenom: txGasPriceDenom,
        gasPrice: txGasPrice,
        gasAdjustment: txGasAdjustment,
      });
      const { totalFeesList, estimatedGas: txGasEstimate } = await calculateTxFees(grpcAddress, calculateTxFeeRequest);
      const txFeeEstimate = Number(totalFeesList.find((fee) => fee.denom === 'nhash')?.amount);
  
      return {
        txFeeEstimate: txFeeEstimate || 0,
        txGasEstimate: txGasEstimate || 0,
      }
    }
    return {
      txFeeEstimate: 0,
      txGasEstimate: 0,
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(getTxFeeEstimate.fulfilled, (state, { payload }) => {
      const {
        txFeeEstimate,
        txGasEstimate,
      } = payload;
      state.txFeeEstimate = txFeeEstimate;
      state.txGasEstimate = txGasEstimate;
    })
  },
  reducers: {
    // SEND COIN
    setTxSendAddress(state, action) {
      state.txSendAddress = action.payload;
    },
    
    setTxFromAddress(state, action) {
      state.txFromAddress = action.payload;
    },

    setCoinAmount(state, action) {
      state.coinAmount = action.payload;
    },

    setCoin(state, action) {
      state.coin = action.payload;
    },

    setMemo(state, action) {
      state.txMemo = action.payload;
    },
  },
});

export const messageActions = {
  ...messageSlice.actions,
  getTxFeeEstimate,
};

/**
 * SELECTORS
 */
export const selectMessage = (state: RootState) => state.message;

export default messageSlice.reducer;