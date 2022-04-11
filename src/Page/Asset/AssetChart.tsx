import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chart, Loading } from 'Components';
import { MARKER_URL } from 'consts';
import { hashFormat, generateLabels, generateStartDate } from 'utils';

const ChartArea = styled.div`
  min-height: 350px;
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
  margin-top: 24px;
`;
const ChartMessage = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;
const ChartOption = styled.div<{disabled: boolean, active: boolean}>`
  cursor: ${({ active }) => active ? 'initial' : 'pointer' };
  background: ${({ active }) => active ? '#01504F' : 'transparent' };
  font-size: 1.2rem;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  user-select: none;
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'initial' };
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface FetchMarkerType {
  timestamp: string,
  price: number,
}

type LabelType = string[];

const timePeriodOptions = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL'] as const;
type TimePeriodType  = typeof timePeriodOptions[number];

export const AssetChart:React.FC = () => {
  const dateNow = new Date().toISOString();
  const { assetName } = useParams();
  const [markerData, setMarkerData] = useState([]);
  const [fetchData, setFetchDate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriodType>('HOURLY');
  const [startDate, setStartDate] = useState(generateStartDate(timePeriod));
  const [endDate] = useState(dateNow);
  const [chartLabels, setChartLabels] = useState<LabelType>(['']);

  useEffect(() => {
    async function fetchMarkerData() {
      const isHash = assetName === 'hash';
      const fetchName = isHash ? 'nhash' : assetName;
      const fetchUrl = `${MARKER_URL}/${fetchName}?period=${timePeriod}&startDate=${startDate}&endDate=${endDate}`;
      setLoading(true);
      const newMarkerData = await fetch(fetchUrl)
        .then(response => response.json())
        .then(data => data);
      const newChartLabels = newMarkerData.reverse().map(({ timestamp }: FetchMarkerType) => timestamp);
      setChartLabels(generateLabels(timePeriod, newChartLabels));
      const markerDataPrice = newMarkerData.map(({ price }: FetchMarkerType) => isHash ? hashFormat('nhash', price) : price
      );
      setMarkerData(markerDataPrice);
      setLoading(false);
    }
    if (fetchData) {
      setFetchDate(false);
      fetchMarkerData();
    };
  }, [markerData, assetName, timePeriod, startDate, endDate, fetchData]);

  const changeTimePeriod = (value: TimePeriodType) => {
    if (value !== timePeriod) {
      setTimePeriod(value);
      const newStartDate = generateStartDate(value);
      setStartDate(newStartDate);
      setFetchDate(true);
    };
  };

  return (
    <ChartArea>
      {loading ? <Loading /> : (
        markerData && !!markerData.length ?
        <Chart data={markerData} labels={chartLabels} /> :
        <ChartMessage>No Data Available</ChartMessage>
      )}
      <ChartOptions>
        <ChartOption disabled={loading} active={timePeriod === 'HOURLY'} onClick={() => changeTimePeriod('HOURLY')}>H</ChartOption>
        <ChartOption disabled={loading} active={timePeriod === 'DAILY'} onClick={() => changeTimePeriod('DAILY')}>D</ChartOption>
        <ChartOption disabled={loading} active={timePeriod === 'WEEKLY'} onClick={() => changeTimePeriod('WEEKLY')}>W</ChartOption>
        <ChartOption disabled={loading} active={timePeriod === 'MONTHLY'} onClick={() => changeTimePeriod('MONTHLY')}>M</ChartOption>
        <ChartOption disabled={loading} active={timePeriod === 'YEARLY'} onClick={() => changeTimePeriod('YEARLY')}>Y</ChartOption>
        <ChartOption disabled={loading} active={timePeriod === 'ALL'} onClick={() => changeTimePeriod('ALL')}>A</ChartOption>
      </ChartOptions>
    </ChartArea>
  );
};
