import { GetTxFeeEstimate, GetTxFeeEstimateResponse } from 'types';
import { getGrpcApi } from '../deriveApiAddress';
import { getDefaultMsgFees } from './getDefaultMsgFees';
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
  gasPrice,
  gasPriceDenom,
  gasAdjustment = 1.25,
  customGRPCApi,
}: GetTxFeeEstimate): Promise<GetTxFeeEstimateResponse> => {
  let finalGasPrice = gasPrice as number;
  let finalGasPriceDenom = gasPriceDenom;
  // If we are not given a manual gasPrice and gasPriceDenom, go pull it from the API
  if (!gasPrice || !gasPriceDenom) {
    const { denom, amount } = await getDefaultMsgFees();
    finalGasPrice = gasPrice || Number(amount);
    finalGasPriceDenom = gasPriceDenom || denom;
  }
  const grpcAddress = customGRPCApi || getGrpcApi(address);
  const { baseAccount } = await getAccountInfo(address, grpcAddress);
  const calculateTxFeeRequest = buildCalculateTxFeeRequest({
    msgAny,
    account: baseAccount,
    publicKey: bufferToBytes(convertUtf8ToBuffer(publicKey)),
    gasPriceDenom: finalGasPriceDenom,
    gasLimit: finalGasPrice,
    gasAdjustment,
  });
  const { estimatedGas: txGasEstimate, totalFeesList } = await calculateTxFees(
    grpcAddress,
    calculateTxFeeRequest
  );

  return {
    txFeeEstimate: [
      { amount: `${txGasEstimate * finalGasPrice}`, denom: 'nhash' },
      ...totalFeesList,
    ],
    txGasEstimate: txGasEstimate || 0,
  };
};
