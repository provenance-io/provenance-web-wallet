export interface TxAttribute {
  key: string;
  value: string;
  index: boolean;
}

export interface TxEvent {
  type: string;
  attributesList: TxAttribute[];
}

export interface TxLogs {
  msgIndex: number;
  log: string;
  eventsList: TxEvent[];
}

export interface TransactionRequest {
  address: string;
  code: number;
  codespace: string;
  data: string;
  date: string;
  description: string;
  eventList: TxEvent[];
  gasFee: string;
  gasPrice: {
    gasPrice: number;
    gasPriceDenom: string;
  };
  gasUsed: number;
  gasWanted: number;
  height: number;
  info: string;
  logsList: TxLogs[];
  rawLog: string;
  timestamp: string;
  tx: any;
  txhash: string;
  platform?: string;
}

export interface AmountObject {
  amount: string | number;
  denom: string;
}

export type TransactionHistory = {
  hash?: string;
  signer: string;
  type: string;
  feeAmount: string;
  time: string;
  status: string;
  block: number;
  denom?: string;
  senderAddress: string;
  recipientAddress?: string;
  amount?: string | number | AmountObject;
  'transaction hash'?: string;
};

export interface TxQueryResults {
  transactions: TransactionHistory[];
  pages: number;
  totalCount: number;
}
