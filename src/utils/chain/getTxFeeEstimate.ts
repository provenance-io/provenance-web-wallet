import { GetTxFeeEstimate, GetTxFeeEstimateResponse } from 'types';
import { getGrpcApi } from '../deriveApiAddress';
import {
  buildCalculateTxFeeRequest,
  calculateTxFees,
  getAccountInfo,
} from '@provenanceio/wallet-utils';
import { bufferToBytes, convertUtf8ToBuffer } from './common';

export const getTxFeeEstimate = async ({
  publicKey,
  msgAny,
  address,
  gasPrice = 19050, // TODO: This should come from an API - Not hardcoded
  gasPriceDenom = 'nhash', // TODO: This should come from an API - Not hardcoded
  gasAdjustment = 1.25,
}: GetTxFeeEstimate): Promise<GetTxFeeEstimateResponse> => {
  const grpcAddress = getGrpcApi(address);
  const { baseAccount } = await getAccountInfo(address, grpcAddress);
  const calculateTxFeeRequest = buildCalculateTxFeeRequest({
    msgAny,
    account: baseAccount,
    publicKey: bufferToBytes(convertUtf8ToBuffer(publicKey)),
    gasPriceDenom,
    gasPrice,
    gasAdjustment,
  });
  const { estimatedGas: txGasEstimate } = await calculateTxFees(
    grpcAddress,
    calculateTxFeeRequest
  );

  return {
    txFeeEstimate: txGasEstimate * gasPrice,
    txGasEstimate: txGasEstimate || 0,
  };
};
