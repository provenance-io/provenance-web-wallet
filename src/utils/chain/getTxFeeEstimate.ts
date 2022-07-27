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
  gasPrice = 19050,
  gasPriceDenom = 'nhash',
  gasAdjustment = 1.25,
}: GetTxFeeEstimate): Promise<GetTxFeeEstimateResponse> => {
  console.log(gasPrice);
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
    txFeeEstimate: txGasEstimate * gasPrice || 0,
    txGasEstimate: txGasEstimate || 0,
  };
};
