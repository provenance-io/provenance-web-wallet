import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chart, Loading } from 'Components';
import { MARKER_API_URL } from 'consts';
import { hashFormat, generateStartDate, percentChange } from 'utils';
import {
  FetchMarkerType,
  ChartLabelsType,
  ChartValuesType,
  ChartValueDiffsType,
  TimePeriodType,
  ChangeValueType,
  ChartValueDiffPercentsType,
} from 'types';

const ChartArea = styled.div`
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
`;
const ChartOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const ChartMessage = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;
const ChartOption = styled.div<{ disabled: boolean; active: boolean }>`
  cursor: ${({ active }) => (active ? 'initial' : 'pointer')};
  background: ${({ active }) => (active ? '#01504F' : 'transparent')};
  font-size: 1.2rem;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  user-select: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  onValueChange: ChangeValueType;
  setError: (e: string | boolean) => void;
  setLoading: (e: boolean) => void;
  loading: boolean;
}

export const AssetChart: React.FC<Props> = ({
  onValueChange,
  setError,
  loading,
  setLoading,
}) => {
  const dateNow = new Date().toISOString();
  // Page Asset
  const { assetName } = useParams();
  // Api Fetch
  const [fetchData, setFetchData] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriodType>('HOURLY');
  const [startDate, setStartDate] = useState(generateStartDate(timePeriod));
  const [endDate] = useState(dateNow);
  // Chart data
  const [chartValues, setChartValues] = useState<ChartValuesType>([]);
  const [chartValueDiffs, setChartValueDiffs] = useState<ChartValueDiffsType>([]);
  const [chartValueDiffPercents, setChartValueDiffPercents] =
    useState<ChartValueDiffPercentsType>([]);
  const [chartLabels, setChartLabels] = useState<ChartLabelsType>(['']);

  useEffect(() => {
    // Get marker data based on page and time period selected
    async function fetchMarkerData() {
      const isHash = assetName === 'hash';
      const fetchName = isHash ? 'nhash' : assetName;
      const fetchUrl = `${MARKER_API_URL}/${fetchName}?period=${timePeriod}&startDate=${startDate}&endDate=${endDate}`;
      setLoading(true);
      setError(false);
      // TODO: Move this data into the redux store and pull from there instead (remove promise chain within component here)
      const newMarkerData = await fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => data);
      const apiError = newMarkerData.error !== undefined || '';
      if (!apiError) {
        // API Returns data decending.  Reverse to change to ascending
        const sortedMarkerData = newMarkerData.reverse();
        // Updated chart data
        const newLabels: ChartLabelsType = [];
        const newValues: ChartValuesType = [];
        const newValueDiffs: ChartValueDiffsType = [];
        const newValueDiffPercents: ChartValueDiffPercentsType = [];
        // Loop through each api value and split into chart data arrays
        sortedMarkerData.forEach(
          ({ timestamp, price }: FetchMarkerType, index: number) => {
            // Convert nhash to hash if needed
            console.log('price :', price);
            const finalPrice = isHash ? hashFormat(price, 'hash') : price;
            console.log('finalPrice :', finalPrice);
            // Calculate price change from first price
            const diff = price - sortedMarkerData[0].price;
            // Calculate percent change
            const finalValueDiffPercents = percentChange(
              sortedMarkerData[0].price,
              price
            );
            const finalValueDiffs = isHash ? hashFormat(diff, 'hash') : diff;
            // Add data to appropriate array
            newValueDiffPercents.push(finalValueDiffPercents);
            newLabels.push(timestamp);
            newValues.push(finalPrice);
            newValueDiffs.push(finalValueDiffs);
          }
        );
        setChartLabels(newLabels);
        setChartValues(newValues);
        setChartValueDiffs(newValueDiffs);
        setChartValueDiffPercents(newValueDiffPercents);
        console.log('newValues: ', newValues);

        // Update the price to be the latest value
        onValueChange({
          value: newValues[newValues.length - 1],
          date: newLabels[newLabels.length - 1],
          diff: newValueDiffs[newValueDiffs.length - 1],
          diffPercent: newValueDiffPercents[newValueDiffPercents.length - 1],
          timePeriod,
        });
      } else {
        setError(apiError);
      }
      setLoading(false);
    }
    if (fetchData) {
      setFetchData(false);
      fetchMarkerData();
    }
  }, [
    assetName,
    timePeriod,
    startDate,
    endDate,
    fetchData,
    onValueChange,
    chartLabels,
    chartValues,
    setError,
    setLoading,
  ]);

  const changeTimePeriod = (value: TimePeriodType) => {
    if (value !== timePeriod) {
      setTimePeriod(value);
      const newStartDate = generateStartDate(value);
      setStartDate(newStartDate);
      setFetchData(true);
    }
  };

  return (
    <ChartArea>
      {loading ? (
        <Loading />
      ) : chartValues && !!chartValues.length ? (
        <Chart
          values={chartValues}
          labels={chartLabels}
          diffs={chartValueDiffs}
          diffPercents={chartValueDiffPercents}
          onValueChange={onValueChange}
          timePeriod={timePeriod}
        />
      ) : (
        <ChartMessage>No Data Available</ChartMessage>
      )}
      <ChartOptions>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'MINUTE'}
          onClick={() => changeTimePeriod('MINUTE')}
        >
          1H
        </ChartOption>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'HOURLY'}
          onClick={() => changeTimePeriod('HOURLY')}
        >
          1D
        </ChartOption>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'DAILY'}
          onClick={() => changeTimePeriod('DAILY')}
        >
          1W
        </ChartOption>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'WEEKLY'}
          onClick={() => changeTimePeriod('WEEKLY')}
        >
          1M
        </ChartOption>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'MONTHLY'}
          onClick={() => changeTimePeriod('MONTHLY')}
        >
          1Y
        </ChartOption>
        <ChartOption
          disabled={loading}
          active={timePeriod === 'ALL'}
          onClick={() => changeTimePeriod('ALL')}
        >
          A
        </ChartOption>
      </ChartOptions>
    </ChartArea>
  );
};
