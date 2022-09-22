import { useAssetChart } from 'redux/hooks';
import { useGetMarkerQuery } from 'redux/services';
import styled from 'styled-components';
import { COLORS } from 'theme';
import type { TimePeriodType } from 'types';
import { generateStartDate } from 'utils';

const ChartOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ChartOption = styled.div<{ disabled: boolean; active: boolean }>`
  cursor: ${({ active }) => (active ? 'initial' : 'pointer')};
  background: ${({ active }) => (active ? COLORS.SECONDARY_650 : 'transparent')};
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

export const AssetChartOptions: React.FC = () => {
  const { assetName, timePeriod, startDate, endDate, setAssetChartData } =
    useAssetChart();
  const { isLoading, isFetching } = useGetMarkerQuery({
    period: timePeriod,
    startDate,
    endDate,
    marker: assetName!,
  });
  const loading = isLoading || isFetching;

  const changeTimePeriod = (value: TimePeriodType) => {
    if (value !== timePeriod) {
      const newStartDate = generateStartDate(value);
      setAssetChartData({ timePeriod: value, startDate: newStartDate });
    }
  };

  return (
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
  );
};
