import styled from 'styled-components';
import { Sprite, Title, InfoText } from 'Components';
import customizationCarousel from 'images/customization-carousel.svg';
import { numberFormat } from 'utils';
import { Statistics } from 'types';

const SlideContainer = styled.div`
  min-width: 311px;
`;

const CustomizationImg = styled.img`
  margin-top: 45px;
  width: 210px;
`;
const StatsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`;
const StatItem = styled.div`
  flex-basis: 50%;
  margin-top: 32px;
`;
const StatTitle = styled.div`
  margin-top: 8px;
  font-size: 1.4rem;
`;
const StatValue = styled.div`
  font-size: 3.8rem;
  font-weight: 300;
`;
const StatValueSmall = styled.span`
  font-size: 2.4rem;
`;

const formatNumber = (value: number, digits = 1) =>
    numberFormat({ rawValue: value, digits, extraOptions: { shorthand: true } });

const valueText = (
  value?: string | number,
  text?: string | number,
  position: 'front' | 'back' = 'front'
) => (
  <>
    {position === 'front' && <StatValueSmall>{text}</StatValueSmall>}
    {value}
    {position === 'back' && <StatValueSmall>{text}</StatValueSmall>}
  </>
);

export const Slide01:React.FC = () => (
  <SlideContainer>
    <Sprite icon="ICON::PROVENANCE" size="6rem" color="#3F80F3" />
    <Title>Provenance Wallet</Title>
    <InfoText>
      A wallet provides an easy way to manage multiple blockchain accounts.
    </InfoText>
  </SlideContainer>
);

interface Props {
  statistics?: Statistics
}

export const Slide02:React.FC<Props> = ({ statistics = {} }) => {
  const { marketCap, validators, transactions, averageBlockTime } = statistics;

  return (
    <SlideContainer>
      <Title>Strong Fundamentals</Title>
      <StatsSection>
        <StatItem>
          <StatValue>
            {marketCap ? valueText(formatNumber(marketCap), '$') : 'N/A'}
          </StatValue>
          <StatTitle>Market Cap</StatTitle>
        </StatItem>
        <StatItem>
          <StatValue>{validators || 'N/A'}</StatValue>
          <StatTitle>Validators</StatTitle>
        </StatItem>
        <StatItem>
          <StatValue>
            {transactions ? formatNumber(transactions, 2) : 'N/A'}
          </StatValue>
          <StatTitle>Transactions</StatTitle>
        </StatItem>
        <StatItem>
          <StatValue>
            {averageBlockTime
              ? valueText(formatNumber(averageBlockTime, 3), 'sec', 'back')
              : 'N/A'}
          </StatValue>
          <StatTitle>Avg Block Time</StatTitle>
        </StatItem>
      </StatsSection>
      <InfoText>Contract execution in seconds instead of weeks.</InfoText>
    </SlideContainer>
  );
};

export const Slide03:React.FC = () => (
  <SlideContainer>
    <Title>Powerful Customization</Title>
    <CustomizationImg
      src={customizationCarousel}
      alt="Figure and Provenance Logos"
    />
    <InfoText>
      Fully control your wallet and crypto, and manage it independently.
    </InfoText>
  </SlideContainer>
);
