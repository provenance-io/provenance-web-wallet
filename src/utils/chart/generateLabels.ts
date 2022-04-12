import { LabelType, TimePeriodType } from 'types';

export const generateLabels = (newTimePeriod: TimePeriodType, labels: LabelType) => {  
  switch (newTimePeriod) {
    case 'HOURLY': return labels.map((date: string) => {
      let hours = new Date(date).getHours();
      const per = (hours >= 12) ? 'PM' : 'AM';
      hours %= 12;
      hours = hours || 12;
      return `${hours} ${per}`
    });
    case 'DAILY': // fallthrough
    case 'WEEKLY': return labels.map((date: string) => `${new Date(date).getMonth()}/${new Date(date).getDate()}`);
    case 'MONTHLY': return labels.map((date: string) => `${new Date(date).getMonth()}`);
    case 'YEARLY': return labels.map((date: string) => `${new Date(date).getFullYear()}`);
    case 'ALL': return labels.map((date: string) => `${new Date(date).getMonth()}/${new Date(date).getFullYear()}`);
    default: return [''];
  }
};
