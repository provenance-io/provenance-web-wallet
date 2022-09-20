import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getServiceMobileApi } from 'utils';
import { SMW_STATS_URL } from 'consts';
import type { Statistics } from 'types';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (builder) => ({
    getStatistics: builder.query<Statistics, string | void>({
      query: (address) => getServiceMobileApi(address, SMW_STATS_URL),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStatisticsQuery } = statisticsApi;
