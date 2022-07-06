export type AllTransactions = {
  block: number;
  feeAmount: string;
  hash: string;
  signer: string;
  status: string;
  time: string;
  type: string;
};

export type Asset = {
  amount: string;
  dailyHigh: number;
  dailyLow: number;
  dailyVolume: number;
  denom: string;
  description: string;
  display: string;
  displayAmount: string;
  exponent: number;
  usdPrice: number;
};

export type Transaction = {
  amount: number;
  block: number;
  denom: string;
  exponent: number;
  hash: string;
  pricePerUnit: number;
  recipientAddress: string;
  senderAddress: string;
  status: string;
  timestamp: string;
  totalPrice: number;
  txFee: number;
};

export interface Address {
  allTransactionsLoading: boolean;
  assetsLoading: boolean;
  transactionsLoading: boolean;
  allTransactionsPages: number;
  allTransactionsTotalCount: number;
  allTransactions: Array<AllTransactions>;
  assets: Array<Asset>;
  transactions: Array<Transaction>;
  allTransactionsError: any;
  assetsError?: any;
  transactionsError?: any;
};
