import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SMW_ADDRESS_URL, SMW_TRANSACTIONS_URL } from 'consts';
import { getServiceMobileApi } from 'utils';
import type { TxQueryResults } from 'types';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<
      TxQueryResults,
      { address: string; page?: number; count?: number }
    >({
      query: ({ address, page, count }) => {
        const searchParamsObj = new URLSearchParams();
        // Page and count are optional params
        if (page) searchParamsObj.append('page', `${page}`);
        if (count) searchParamsObj.append('count', `${count}`);
        // Base api url (without page or count)
        const urlObj = new URL(
          getServiceMobileApi(
            address,
            `${SMW_ADDRESS_URL}/${address}${SMW_TRANSACTIONS_URL}`
          )
        );
        // Append page/count to url as needed
        urlObj.search = searchParamsObj.toString();

        return urlObj.toString();
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTransactionsQuery } = transactionsApi;
