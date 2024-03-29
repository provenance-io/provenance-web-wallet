const timePeriodOptions = [
  'MINUTE',
  'HOURLY',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
  'ALL',
] as const;

export type TimePeriodType = typeof timePeriodOptions[number];
export type ChartLabelsType = string[];
export type ChartValuesType = number[];
export type ChartValueDiffsType = number[];
export type ChartValueDiffPercentsType = string[];

export interface FetchMarkerType {
  timestamp: string;
  price: number;
}

export interface ChartDataItem {
  value: number;
  label: string | number;
  change: number;
}
export type ChartData = ChartDataItem[];
export interface ChangeValueArgs {
  value?: number;
  diff?: number;
  diffPercent?: string;
  date?: string;
  timePeriod?: TimePeriodType;
}
export type ChangeValueType = ({
  value,
  diff,
  diffPercent,
  date,
  timePeriod,
}: ChangeValueArgs) => void;

export interface AssetChart {
  assetName: string;
  currentAssetValue: number;
  currentPriceChange: number;
  currentPriceChangePercent: string;
  currentDate: string;
  timePeriod: TimePeriodType;
  startDate: string;
  endDate: string;
  values: number[];
  valueDiffs: number[];
  valueDiffPercents: string[];
  labels: string[];
}

export interface OptionalChartDataPayload {
  assetName?: string;
  currentAssetValue?: number;
  currentPriceChange?: number;
  currentPriceChangePercent?: string;
  currentDate?: string;
  timePeriod?: TimePeriodType;
  startDate?: string;
  endDate?: string;
  values?: number[];
  valueDiffs?: number[];
  valueDiffPercents?: string[];
  labels?: string[];
}
