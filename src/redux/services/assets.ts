import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SMW_ADDRESS_URL } from 'consts';
import { getServiceMobileApi } from 'utils';
import type { Asset } from 'types';

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (builder) => ({
    getAssets: builder.query<Asset[], string>({
      query: (address) => {
        return getServiceMobileApi(address, `${SMW_ADDRESS_URL}/${address}/assets`);
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAssetsQuery } = assetsApi;
