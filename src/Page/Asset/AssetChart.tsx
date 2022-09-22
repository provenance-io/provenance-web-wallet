import styled from 'styled-components';
import { Loading } from 'Components';
import { hashFormat, percentChange } from 'utils';
import { Chart } from './Chart';
import type {
  FetchMarkerType,
  ChartLabelsType,
  ChartValuesType,
  ChartValueDiffsType,
  ChartValueDiffPercentsType,
} from 'types';
import { useAssetChart } from 'redux/hooks';
import { useGetMarkerQuery } from 'redux/services';
import { useEffect } from 'react';

const ChartArea = styled.div`
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
`;

const ChartMessage = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

// AssetChart.txs will take the raw data from the API and massage it to work/look right withing Chart.tsx
export const AssetChart: React.FC = () => {
  const { assetName, timePeriod, startDate, endDate, values, setAssetChartData } =
    useAssetChart();
  const {
    data: markerHistory = [],
    isLoading,
    isFetching,
  } = useGetMarkerQuery({
    period: timePeriod,
    startDate,
    endDate,
    marker: assetName!,
  });
  const loading = isLoading || isFetching;

  useEffect(() => {
    const isHash = assetName === 'hash';
    // API Returns data decending.  Reverse to change to ascending
    const sortedMarkerData = markerHistory.reverse();
    // Updated chart data
    const newLabels: ChartLabelsType = [];
    const newValues: ChartValuesType = [];
    const newValueDiffs: ChartValueDiffsType = [];
    const newValueDiffPercents: ChartValueDiffPercentsType = [];
    // Loop through each api value and split into chart data arrays
    sortedMarkerData.forEach(({ timestamp, price }: FetchMarkerType) => {
      // Convert nhash to hash if needed
      const finalPrice = isHash ? hashFormat(price, 'hash') : price;
      // Calculate price change from first price
      const diff = price - sortedMarkerData[0].price;
      // Calculate percent change
      const finalValueDiffPercents = percentChange(sortedMarkerData[0].price, price);
      const finalValueDiffs = isHash ? hashFormat(diff, 'hash') : diff;
      // Add data to appropriate array
      newValueDiffPercents.push(finalValueDiffPercents);
      newLabels.push(timestamp);
      newValues.push(finalPrice);
      newValueDiffs.push(finalValueDiffs);
    });
    setAssetChartData({
      values: newValues,
      labels: newLabels,
      valueDiffPercents: newValueDiffPercents,
      valueDiffs: newValueDiffs,
    });
  }, [assetName, markerHistory, setAssetChartData]);

  return (
    <ChartArea>
      {loading ? (
        <Loading />
      ) : values && !!values.length ? (
        <Chart />
      ) : (
        <ChartMessage>No Data Available</ChartMessage>
      )}
    </ChartArea>
  );
};
