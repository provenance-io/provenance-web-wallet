import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SMW_MARKER_URL } from 'consts';
import { getServiceMobileApi } from 'utils';
import type { MarkerPriceHistory, MarkerApiParams } from 'types';

export const markerApi = createApi({
  reducerPath: 'markerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  endpoints: (builder) => ({
    getMarker: builder.query<MarkerPriceHistory[], MarkerApiParams>({
      query: ({ address, marker, startDate, endDate, period }) => {
        // When fetching hash, search for nhash
        const markerFetchName = marker === 'hash' ? 'nhash' : marker;
        return getServiceMobileApi(
          address,
          `${SMW_MARKER_URL}/${markerFetchName}?period=${period}&startDate=${startDate}&endDate=${endDate}`
        );
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMarkerQuery } = markerApi;
