import { useParams } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { FooterNav, Header, Sprite, AssetRow } from 'Components';
import { ICON_NAMES } from 'consts';
import { AssetChart } from './AssetChart';
import { AssetStats } from './AssetStats';
import { ChangeValueArgs } from 'types';
import { format } from 'date-fns';

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  font-family: 'Gothic A1', sans-serif;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 80px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
`;
const HeaderTitle = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`
const HeaderIcon = styled.img`
  width:30px;
`;
const Price = styled.div`
  font-size: 4.4rem;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  span {
   font-size: 3.4rem; 
  }
`;
const PriceChange = styled.div<{polarity: string}>`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Gothic A1', sans-serif;
  color: ${({ polarity }) => polarity === 'positive' ? '#04F19C' : polarity === 'negative' ? '#F16F04' : '#A6A6A6' };
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CurrentDate = styled.div`
  font-size: 1.4rem;
  font-family: 'Gothic A1', sans-serif;
  font-weight: 400;
  margin-top: 30px;
`;
const SectionTitle = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 30px 0 10px 0;
  text-align: left;
`;

export const Asset:React.FC = () => {
  const { assetName } = useParams();
  const [currentAssetValue, setCurrentAssetValue] = useState(0);
  const [currentPriceChange, setCurrentPriceChange] = useState(0)
  const [currentPriceChangePercent, setCurrentPriceChangePercent] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const onValueChange = ({value = 0, diff = 0, diffPercent = '', date = ''}: ChangeValueArgs) => {
    setCurrentAssetValue(value);
    setCurrentPriceChange(diff);
    setCurrentPriceChangePercent(diffPercent);
    setCurrentDate(date);
  };

  const PriceChangePolarity = currentPriceChange === 0 ? 'neutral' : currentPriceChange > 0 ? 'positive' : 'negative';

  return (
    assetName ? 
    <Wrapper>
      <HeaderTitleGroup>
        <Header
          title={<HeaderIcon src={`/images/assets/${assetName}.svg`} alt={`${assetName} icon`} />}
          marginBottom="10px"
        />
        <HeaderTitle>{assetName}</HeaderTitle>
      </HeaderTitleGroup>
      <Price>{currentAssetValue ? <><span>$</span>{currentAssetValue.toFixed(3)}</> : 'Loading'}</Price>
      <PriceChange polarity={PriceChangePolarity}>
        {PriceChangePolarity !== 'neutral' && <Sprite icon={ICON_NAMES.ARROW_TALL} size="1.5rem" spin={PriceChangePolarity === 'positive' ? '0' : '180'} />}
        ${currentPriceChange.toFixed(2)}{PriceChangePolarity !== 'neutral' && ` (${currentPriceChangePercent})`}
      </PriceChange>
      {currentDate && <CurrentDate>{format(new Date(currentDate), 'h:MM bb, MMM dd, yyyy')}</CurrentDate>}
      <AssetChart onValueChange={onValueChange} />
      <AssetStats />
      <SectionTitle>Recent Transactions</SectionTitle>
      <div>
        <AssetRow img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
        <AssetRow img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
        <AssetRow img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
        <AssetRow img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
      </div>
      <FooterNav />
    </Wrapper>
    : null
  );
};