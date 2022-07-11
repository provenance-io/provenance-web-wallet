import { ReadableMessageNames, SupportedDenoms } from '@provenanceio/wallet-utils';
import { Asset } from './Address';

export interface Message {
  coinAddress?: string;
  coinAmount?: string;
  coin?: Asset;
  txMemo?: string;
  txBaseAccount?: string,
  txSendAddress?: string,
  txFromAddress?: string,
  txFeeEstimate?: number,
  txFeeDenom: string,
  txGasPrice: number,
  txGasPriceAdjustment: number,
  txGasPriceDenom: SupportedDenoms,
  txGasEstimate?: number,
  txGasAdjustment?: number,
  txType?: ReadableMessageNames,
};
