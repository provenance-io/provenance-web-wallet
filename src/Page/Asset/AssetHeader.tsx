import styled from 'styled-components';
import { Header, Typo, Sprite as BaseSprite } from 'Components';
import { generateLabels } from 'utils';
import { ICON_NAMES, ASSET_IMAGE_NAMES } from 'consts';
import { useGetMarkerQuery } from 'redux/services';
import { useAssetChart } from 'redux/hooks';

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4px;
  text-transform: uppercase;
`;
const Sprite = styled(BaseSprite)`
  vertical-align: middle;
`;
const USD = styled.span`
  font-size: 3.4rem;
  margin-right: 4px;
`;
const HeaderIcon = styled.img`
  width: 30px;
`;

export const AssetHeader: React.FC = () => {
  const {
    assetName,
    currentPriceChange,
    currentAssetValue,
    currentPriceChangePercent,
    currentDate,
    timePeriod,
    startDate,
    endDate,
  } = useAssetChart();
  const {
    error: markerHistoryApiError,
    isLoading,
    isFetching,
  } = useGetMarkerQuery({
    period: timePeriod,
    startDate,
    endDate,
    marker: assetName!,
  });
  const loading = isLoading || isFetching;

  const assetIconName =
    assetName && ASSET_IMAGE_NAMES.includes(assetName) ? assetName : 'provenance';

  const PriceChangeColor =
    currentPriceChange === 0
      ? 'CHART_NEUTRAL'
      : currentPriceChange > 0
      ? 'CHART_POSITIVE'
      : 'CHART_NEGATIVE';

  return (
    <>
      <HeaderTitleGroup>
        <Header
          title={
            <HeaderIcon
              src={`/images/assets/${assetIconName}.svg`}
              alt={`${assetName} icon`}
            />
          }
          marginBottom="10px"
        />
        <Typo type="subhead">{assetName}</Typo>
      </HeaderTitleGroup>
      <Typo type="display1" align="center">
        {markerHistoryApiError ? (
          'N/A'
        ) : loading ? (
          'Loading'
        ) : currentAssetValue ? (
          <>
            <USD>$</USD>
            {currentAssetValue.toFixed(3)}
          </>
        ) : (
          'N/A'
        )}
      </Typo>
      <Typo type="body" bold color={PriceChangeColor} marginBottom="10px">
        {!loading && currentPriceChange !== 0 && (
          <Sprite
            icon={ICON_NAMES.ARROW_TALL}
            size="1.5rem"
            spin={currentPriceChange > 0 ? '0' : '180'}
          />
        )}
        {!loading && currentPriceChange.toFixed(2)}
        {!loading && currentPriceChange !== 0 && ` (${currentPriceChangePercent})`}
      </Typo>
      {!loading && currentDate && (
        <Typo type="body">{generateLabels(currentDate, timePeriod)}</Typo>
      )}
    </>
  );
};
