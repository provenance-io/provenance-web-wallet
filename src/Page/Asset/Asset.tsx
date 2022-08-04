import { useParams } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { FooterNav, Header, Sprite as BaseSprite, Content, Typo } from 'Components';
import { ICON_NAMES, ASSET_IMAGE_NAMES } from 'consts';
import { AssetChart } from './AssetChart';
import { AssetTxs } from './AssetTxs';
import { ChangeValueArgs, TimePeriodType } from 'types';
import { generateLabels } from 'utils';

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

export const Asset: React.FC = () => {
  const { assetName } = useParams();
  const [currentAssetValue, setCurrentAssetValue] = useState(0);
  const [currentPriceChange, setCurrentPriceChange] = useState(0);
  const [currentTimePeriod, setCurrentTimePeriod] =
    useState<TimePeriodType>('HOURLY');
  const [loading, setLoading] = useState(true);
  const [currentPriceChangePercent, setCurrentPriceChangePercent] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [error, setError] = useState<string | boolean>(false);

  const onValueChange = ({
    value = 0,
    diff = 0,
    diffPercent = '',
    date = '',
    timePeriod = 'HOURLY',
  }: ChangeValueArgs) => {
    setCurrentAssetValue(value);
    setCurrentPriceChange(diff);
    setCurrentPriceChangePercent(diffPercent);
    setCurrentDate(date);
    setCurrentTimePeriod(timePeriod);
  };

  const PriceChangeColor =
    currentPriceChange === 0
      ? 'CHART_NEUTRAL'
      : currentPriceChange > 0
      ? 'CHART_POSITIVE'
      : 'CHART_NEGATIVE';

  const assetIconName =
    assetName && ASSET_IMAGE_NAMES.includes(assetName) ? assetName : 'provenance';

  return assetName ? (
    <Content padBottom="80px">
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
        {error ? (
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
        {currentPriceChange !== 0 && (
          <Sprite
            icon={ICON_NAMES.ARROW_TALL}
            size="1.5rem"
            spin={currentPriceChange > 0 ? '0' : '180'}
          />
        )}
        ${currentPriceChange.toFixed(2)}
        {currentPriceChange !== 0 && ` (${currentPriceChangePercent})`}
      </Typo>
      {currentDate && (
        <Typo type="body">{generateLabels(currentDate, currentTimePeriod)}</Typo>
      )}
      <AssetChart
        onValueChange={onValueChange}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
      />
      <AssetTxs assetName={assetName} />
      <FooterNav />
    </Content>
  ) : null;
};
