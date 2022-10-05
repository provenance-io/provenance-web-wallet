import { TimePeriodType } from 'types';

export const generateStartDate = (newTimePeriod: TimePeriodType) => {
  const now = new Date();
  switch (newTimePeriod) {
    case 'MINUTE': {
      // Get the past 60 min (1 Hour)
      // Note: Set all second and ms values to 0 to allow caching
      now.setMinutes(now.getMinutes() - 60, 0, 0);
      return new Date(now).toISOString();
    }
    case 'HOURLY': {
      // Get the past 24 hours (1 Day)
      now.setHours(now.getHours() - 24);
      // Note: Set all second and ms values to 0 to allow caching
      now.setSeconds(0, 0);
      return new Date(now).toISOString();
    }
    case 'DAILY': {
      // Get the past 1 week (7 Day)
      now.setHours(now.getHours() - 7 * 24);
      // Note: Set all second and ms values to 0 to allow caching
      now.setSeconds(0, 0);
      return new Date(now).toISOString();
    }
    case 'WEEKLY': {
      // Get the past 1 Month (4 Week)
      now.setMonth(now.getMonth() - 1);
      // Note: Set all second and ms values to 0 to allow caching
      now.setSeconds(0, 0);
      return new Date(now).toISOString();
    }
    case 'MONTHLY': {
      // Get the past 1 Yeah (12 Months)
      now.setFullYear(now.getFullYear() - 1);
      // Note: Set all second and ms values to 0 to allow caching
      now.setSeconds(0, 0);
      return new Date(now).toISOString();
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
