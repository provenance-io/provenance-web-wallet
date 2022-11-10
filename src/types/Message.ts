import type { CoinAsObject, ReadableMessageNames } from '@provenanceio/wallet-utils';
import type { Asset } from './Asset';

export interface Message {
  coin?: Asset;
  coinAddress?: string;
  coinAmount?: string;
  displayAmount?: string;
  txBaseAccount?: string;
  txDate?: number;
  txFeeDenom: string;
  txFeeEstimate?: number;
  txFeeEstimateCoins?: CoinAsObject[];
  txFromAddress?: string;
  txGasAdjustment?: number;
  txGasEstimate?: number;
  txMemo?: string;
  txMsgAny?: any;
  txSendAddress?: string;
  txType?: ReadableMessageNames;
  txResponse?: any;
}
