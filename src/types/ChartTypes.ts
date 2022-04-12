const timePeriodOptions = ['MIN', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL'] as const;

export type TimePeriodType  = typeof timePeriodOptions[number];
export type LabelType = string[];

export interface FetchMarkerType {
  timestamp: string,
  price: number,
}
