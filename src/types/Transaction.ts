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

export interface TxResults {
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
