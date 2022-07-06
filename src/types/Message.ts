import { Asset } from './Address';

export interface Message {
  coinAddress?: string;
  coinAmount?: string;
  coin?: Asset;
  txMemo?: string;
};
