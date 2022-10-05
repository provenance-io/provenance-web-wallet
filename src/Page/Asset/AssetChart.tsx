import { Loading, Typo } from 'Components';
import { hashFormat, percentChange } from 'utils';
import { Chart } from './Chart';
import type {
  ChartLabelsType,
  ChartValuesType,
  ChartValueDiffsType,
  ChartValueDiffPercentsType,
} from 'types';
import { useAssetChart } from 'redux/hooks';
import { useGetMarkerQuery } from 'redux/services';
import { useEffect } from 'react';

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
    if (markerHistory.length) {
      const isHash = assetName === 'hash';
      // API Returns data decending.  Reverse to change to ascending
      const sortedMarkerData = [...markerHistory].reverse();
      // Updated chart data
      const newLabels: ChartLabelsType = [];
      const newValues: ChartValuesType = [];
      const newValueDiffs: ChartValueDiffsType = [];
      const newValueDiffPercents: ChartValueDiffPercentsType = [];
      // Loop through each api value and split into chart data arrays
      sortedMarkerData.forEach(({ timestamp, price }) => {
        // Convert nhash to hash if needed
        const finalPrice = isHash ? hashFormat(price, 'hash') : price;
        // Calculate price change from first price of the day
        const initialPrice = sortedMarkerData[0].price;
        const priceDifference = price - initialPrice;
        // Calculate percent change
        const finalValueDiffPercent = percentChange(initialPrice, price);
        const finalValueDiff = isHash
          ? hashFormat(priceDifference, 'hash')
          : priceDifference;
        // Add data to appropriate array
        newValueDiffPercents.push(finalValueDiffPercent);
        newLabels.push(timestamp);
        newValues.push(finalPrice);
        newValueDiffs.push(finalValueDiff);
      });
      setAssetChartData({
        values: newValues,
        labels: newLabels,
        valueDiffPercents: newValueDiffPercents,
        valueDiffs: newValueDiffs,
        // Load in latest information (current)
        currentAssetValue: newValues[newValues.length - 1],
        currentDate: newLabels[newLabels.length - 1],
        currentPriceChange: newValueDiffs[newValueDiffs.length - 1],
        currentPriceChangePercent:
          newValueDiffPercents[newValueDiffPercents.length - 1],
      });
    }
  }, [assetName, markerHistory, setAssetChartData]);

  return loading ? (
    <Loading />
  ) : values && !!values.length ? (
    <Chart />
  ) : (
    <Typo type="subhead" italic marginTop="30px" marginBottom="40px">
      No Historical Data Available
    </Typo>
  );
};
