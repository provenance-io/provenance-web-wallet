import { ReadableMessageNames, SupportedDenoms } from '@provenanceio/wallet-utils';
import { Asset } from './Address';

export interface Message {
  coin?: Asset;
  coinAddress?: string;
  coinAmount?: string;
  txBaseAccount?: string;
  txDate?: number;
  txFeeDenom: SupportedDenoms;
  txFeeEstimate?: number;
  txFromAddress?: string;
  txGasAdjustment?: number;
  txGasEstimate?: number;
  txGasPrice: number;
  txGasPriceAdjustment: number;
  txGasPriceDenom: SupportedDenoms;
  txMemo?: string;
  txMsgAny?: any;
  txSendAddress?: string;
  txType?: ReadableMessageNames;
  txResponse?: any;
}
