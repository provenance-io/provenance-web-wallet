export interface AmountObject {
  amount: string | number;
  denom: string;
}

export type Transaction = {
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

export interface Address {
  assetsLoading: boolean;
  assetsError?: any;
  assets: Array<Asset>;

  transactionsTotalCount: number;
  transactionsPages: number;
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: boolean;
}
