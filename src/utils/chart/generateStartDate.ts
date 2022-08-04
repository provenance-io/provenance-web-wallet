import { TimePeriodType } from 'types';

export const generateStartDate = (newTimePeriod: TimePeriodType) => {
  const now = new Date();
  switch (newTimePeriod) {
    case 'MINUTE': {
      // Get the past 60 min (1 Hour)
      const start = now.setMinutes(now.getMinutes() - 60);
      return new Date(start).toISOString();
    }
    case 'HOURLY': {
      // Get the past 24 hours (1 Day)
      const start = now.setHours(now.getHours() - 24);
      return new Date(start).toISOString();
    }
    case 'DAILY': {
      // Get the past 1 week (7 Day)
      const start = now.setHours(now.getHours() - 7 * 24);
      return new Date(start).toISOString();
    }
    case 'WEEKLY': {
      // Get the past 1 Month (4 Week)
      const start = now.setMonth(now.getMonth() - 1);
      return new Date(start).toISOString();
    }
    case 'MONTHLY': {
      // Get the past 1 Yeah (12 Months)
      const start = now.setFullYear(now.getFullYear() - 1);
      return new Date(start).toISOString();
    }
    // case 'YEARLY': {
    //   // Get the past 12 months (1 Year)
    //   const start = now.setFullYear(now.getFullYear() - 1);
    //   return new Date(start).toISOString();
    // }
    case 'ALL': {
      // Get the all past data
      return '2022-03-11T23:58:01.55Z';
    }
    default:
      return now.toISOString();
  }
};
