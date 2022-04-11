const timePeriodOptions = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL'] as const;
type TimePeriodType  = typeof timePeriodOptions[number];

export const generateStartDate = (newTimePeriod: TimePeriodType) => {  
  const now = new Date();
  switch (newTimePeriod) {
    case 'HOURLY': {
      // Get the past 14 hours
      const start = now.setHours(now.getHours() - 14);
      return new Date(start).toISOString();
    }
    case 'DAILY': {
      // Get the past 7 days
      const start = now.setDate(now.getDate() - 7);
      return new Date(start).toISOString();
    }
    case 'WEEKLY': {
      // Get the past 4 weeks
      const start = now.setDate(now.getMonth() - 1);
      return new Date(start).toISOString();
    }
    case 'MONTHLY': {
      // Get the past 6 months
      const start = now.setMonth(now.getMonth() - 6);
      return new Date(start).toISOString();
    }
    case 'YEARLY': {
      // Get the past 5 years
      const start = now.setFullYear(now.getFullYear() - 5);
      return new Date(start).toISOString();
    }
    default: return now.toISOString();
  }
};
