import { TimePeriodType } from 'types';
import { format } from 'date-fns';

export const generateLabels = (date: string, newTimePeriod: TimePeriodType, ) => {  
  switch (newTimePeriod) {
    case 'MINUTE': return format(new Date(date), 'h:mm aa, MMM dd, yyyy');
    case 'HOURLY': return format(new Date(date), 'h:mm aa, MMM dd, yyyy');
    case 'DAILY': // fallthrough
    case 'WEEKLY': return format(new Date(date), 'MMM dd, yyyy');
    case 'MONTHLY': return format(new Date(date), 'MMM dd, yyyy');
    case 'YEARLY': return format(new Date(date), 'MMM dd, yyyy');
    case 'ALL': return format(new Date(date), 'MMM dd, yyyy');
    default: return date;
  }
};
