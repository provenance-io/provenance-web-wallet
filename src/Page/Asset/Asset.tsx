import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header, Sprite, Chart, Loading } from 'Components';
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

export const Asset:React.FC = () => {
  const dateNow = new Date().toISOString();
  const generateStartDate = (newTimePeriod: TimePeriodType) => {  
    const now = new Date();
    switch (newTimePeriod) {
      case 'HOURLY': {
        // Get the past 14 hours
        const start = now.setHours(now.getHours() - 14);
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
        const start = now.setMonth(now.getMonth() - 6);
        return new Date(start).toISOString();
      }
      case 'YEARLY': {
        // Get the past 5 years
        const start = now.setFullYear(now.getFullYear() - 5);
        return new Date(start).toISOString();
      }
      default: return now.toISOString();
    }
  };
  const { assetName } = useParams();
  const [markerData, setMarkerData] = useState([]);
  const [fetchData, setFetchDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriodType>('HOURLY');
  const [startDate, setStartDate] = useState(generateStartDate(timePeriod));
  const [endDate] = useState(dateNow);
  const [chartLabels, setChartLabels] = useState<LabelType>(['']);

  useEffect(() => {
    async function fetchMarkerData() {
      const generateLabels = (newTimePeriod: TimePeriodType, labels: LabelType) => {  
        switch (newTimePeriod) {
          case 'HOURLY': return labels.map((date: string) => {
            let hours = new Date(date).getHours();
            const per = (hours >= 12) ? 'PM' : 'AM';
            hours %= 12;
            hours = hours || 12;
            return `${hours} ${per}`
          });
          case 'DAILY': // fallthrough
          case 'WEEKLY': return labels.map((date: string) => `${new Date(date).getMonth()}/${new Date(date).getDate()}`);
          case 'MONTHLY': return labels.map((date: string) => `${new Date(date).getMonth()}`);
          case 'YEARLY': return labels.map((date: string) => `${new Date(date).getFullYear()}`);
          default: return [''];
        }
      };
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
      <ChartArea>
        {markerData &&
          loading ? <Loading /> : <Chart data={markerData} labels={chartLabels} />
        }
        <ChartOptions>
          <ChartOption disabled={loading} active={timePeriod === 'HOURLY'} onClick={() => changeTimePeriod('HOURLY')}>H</ChartOption>
          <ChartOption disabled={loading} active={timePeriod === 'DAILY'} onClick={() => changeTimePeriod('DAILY')}>D</ChartOption>
          <ChartOption disabled={loading} active={timePeriod === 'WEEKLY'} onClick={() => changeTimePeriod('WEEKLY')}>W</ChartOption>
          <ChartOption disabled={loading} active={timePeriod === 'MONTHLY'} onClick={() => changeTimePeriod('MONTHLY')}>M</ChartOption>
          <ChartOption disabled={loading} active={timePeriod === 'YEARLY'} onClick={() => changeTimePeriod('YEARLY')}>Y</ChartOption>
          <ChartOption disabled={loading} active={timePeriod === 'ALL'} onClick={() => changeTimePeriod('ALL')}>A</ChartOption>
        </ChartOptions>
      </ChartArea>
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
