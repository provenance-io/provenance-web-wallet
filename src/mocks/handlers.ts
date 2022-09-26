import { rest } from 'msw';
import { SMW_TESTNET } from 'consts';
import {
  nhash_all,
  nhash_daily,
  nhash_hourly,
  nhash_monthly,
  nhash_weekly,
  nhash_yearly,
} from './pricingData';

export const handlers = [
  // Handles a GET /user request
  rest.get(`${SMW_TESTNET}/pricing/marker/nhash`, (req, res, ctx) => {
    const period = req.url.searchParams.get('period');
    // const startDate = req.url.searchParams.get('startDate');
    // const endDate = req.url.searchParams.get('endDate');
    // Based on the request period, return that time data
    const getResultData = () => {
      switch (period) {
        case 'MINUTE':
          return nhash_hourly;
        case 'HOURLY':
          return nhash_daily;
        case 'DAILY':
          return nhash_weekly;
        case 'WEEKLY':
          return nhash_monthly;
        case 'MONTHLY':
          return nhash_yearly;
        case 'ALL': // fallthrough
        default:
          return nhash_all;
      }
    };
    const results = getResultData();

    return res(ctx.status(200), ctx.json(results));
  }),
];
