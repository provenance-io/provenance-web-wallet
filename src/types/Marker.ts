import type { TimePeriodType } from './ChartTypes';

export interface MarkerPriceHistory {
  timestamp: string;
  price: number;
}

export interface MarkerApiParams {
  address?: string;
  marker: string;
  period: TimePeriodType;
  startDate: string;
  endDate: string;
}
