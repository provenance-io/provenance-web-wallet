import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header, Sprite, Chart } from 'Components';
import { ICON_NAMES, MARKER_URL } from 'consts';
import { hashFormat } from 'utils';

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  font-family: 'Gothic A1', sans-serif;
`;
const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderTitle = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`
const HeaderIcon = styled.img`
  width:30px;
  margin-bottom: 10px;
`;
const Price = styled.div`
  font-size: 6.4rem;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 10px;
`;
const PriceChange = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SectionTitle = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 30px 0 10px 0;
  text-align: left;
`;
const ChartOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ChartOption = styled.div`
  cursor: pointer;
`;

interface FetchMarkerType {
  timestamp: string,
  price: number,
}

export const Asset:React.FC = () => {
  const timePeriodOptions = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL'] as const;
  const dateNow = new Date().toISOString();
  const generateStartDate = (newTimePeriod: typeof timePeriodOptions[number]) => {  
    const now = new Date();
    switch (newTimePeriod) {
      case 'HOURLY': {
        // Get the past 14 hours
        const start = now.setDate(now.getHours() - 14);
        return new Date(start).toISOString();
      }
      case 'DAILY': {
        // Get the past 7 days
        const start = now.setDate(now.getDate() - 7);
        return new Date(start).toISOString();
      }
      case 'WEEKLY': {
        // Get the past 4 weeks
        const start = now.setDate(now.getMonth() - 1);
        return new Date(start).toISOString();
      }
      case 'MONTHLY': {
        // Get the past 6 months
        const start = now.setDate(now.getMonth() - 6);
        return new Date(start).toISOString();
      }
      case 'YEARLY': {
        // Get the past 3 years
        const start = now.setDate(now.getMonth() - 32);
        return new Date(start).toISOString();
      }
      default: return now.toISOString();
    }
  };
  const { assetName } = useParams();
  const [markerData, setMarkerData] = useState([]);
  const [fetchData, setFetchDate] = useState(true);
  const [timePeriod, setTimePeriod] = useState<typeof timePeriodOptions[number]>('HOURLY');
  const [startDate, setStartDate] = useState(generateStartDate(timePeriod));
  const [endDate] = useState(dateNow);
  const [chartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    async function fetchMarkerData() {
      const isHash = assetName === 'hash';
      const fetchName = isHash ? 'nhash' : assetName;
      const newMarkerData = await fetch(`${MARKER_URL}/${fetchName}?period=${timePeriod}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => data);
      const newChartLabels = newMarkerData.map(({ timestamp }: FetchMarkerType) => timestamp);
      setChartLabels(newChartLabels);
      const markerDataPrice = newMarkerData.map(({ price }: FetchMarkerType) => isHash ? hashFormat('nhash', price) : price
      );
      setMarkerData(markerDataPrice);
      console.log('newMarkerData :', newMarkerData);
    }
    if (fetchData) {
      setFetchDate(false);
      fetchMarkerData();
    };
  }, [markerData, assetName, timePeriod, startDate, endDate, fetchData]);

  const changeTimePeriod = (value: typeof timePeriodOptions[number]) => {
    setTimePeriod(value);
    const newStartDate = generateStartDate(value);
    setStartDate(newStartDate);
    setFetchDate(true);
  };

  return (
    assetName ? 
    <Wrapper>
      <Header
        title={
          <HeaderTitleGroup>
            <HeaderIcon src={`/images/assets/${assetName}.svg`} alt={`${assetName} icon`} />
            <HeaderTitle>{assetName}</HeaderTitle>
          </HeaderTitleGroup>
        }
      />
      <Price>$0.118</Price>
      <PriceChange>
        <Sprite icon={ICON_NAMES.ARROW_TALL} size="1.5rem" />
        $0.008(0.10%)
      </PriceChange>
      <Chart data={markerData} labels={chartLabels} />
      <ChartOptions>
        <ChartOption onClick={() => changeTimePeriod('HOURLY')}>1H</ChartOption>
        <ChartOption onClick={() => changeTimePeriod('DAILY')}>1D</ChartOption>
        <ChartOption onClick={() => changeTimePeriod('WEEKLY')}>1W</ChartOption>
        <ChartOption onClick={() => changeTimePeriod('MONTHLY')}>1M</ChartOption>
        <ChartOption onClick={() => changeTimePeriod('YEARLY')}>1Y</ChartOption>
        <ChartOption onClick={() => changeTimePeriod('ALL')}>ALL</ChartOption>
      </ChartOptions>
      <SectionTitle>Statistics</SectionTitle>
      <div>Day Volume</div>
      <div>332,850</div>
      <div>Statistics</div>
      <div>X</div>
      <div>Day High</div>
      <div>$0.118</div>
      <div>Day Low</div>
      <div>$0.101</div>
      <SectionTitle>Recent Transactions</SectionTitle>
    </Wrapper>
    : null
  );
};
