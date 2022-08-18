import styled from 'styled-components';
import { Sprite, Typo } from 'Components';
import customizationCarousel from 'images/customization-carousel.svg';
import { numberFormat } from 'utils';
import { Statistics } from 'types';
import { COLORS } from 'theme';

const SlideContainer = styled.div`
  min-width: 340px;
  margin-left: 10px;
`;
const LogoImg = styled.div`
  margin-bottom: 40px;
`;
const CustomizationImg = styled.img`
  margin-top: 16px;
  width: 210px;
`;
const StatsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`;
const StatItem = styled.div`
  flex-basis: 50%;
  margin-top: 20px;
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
const ProvLogoText = styled(Typo)`
  font-size: 1.95rem;
  letter-spacing: 0.5em;
`;

const formatNumber = (value: number, digits = 1) =>
  numberFormat(value, digits, { shorthand: true });

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

export const Slide01: React.FC = () => (
  <SlideContainer>
    <LogoImg>
      <Sprite
        viewBox="-8 0 60 60"
        icon="ICON::PROVENANCE"
        size="60px"
        color={COLORS.PRIMARY_500}
      />
    </LogoImg>
    <ProvLogoText bold type="headline1">
      Provenance Blockchain Wallet
    </ProvLogoText>
    <Typo type="bodyAlt" maxWidth="300px" marginTop="64px">
      A wallet provides an easy way to manage multiple blockchain accounts.
    </Typo>
  </SlideContainer>
);

interface Props {
  statistics?: Statistics;
}

export const Slide02: React.FC<Props> = ({ statistics = {} }) => {
  const { marketCap, validators, transactions, averageBlockTime } = statistics;

  return (
    <SlideContainer>
      <Typo type="headline1">Strong Fundamentals</Typo>
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
              ? valueText(formatNumber(averageBlockTime, 2), 'sec', 'back')
              : 'N/A'}
          </StatValue>
          <StatTitle>Avg Block Time</StatTitle>
        </StatItem>
      </StatsSection>
      <Typo type="bodyAlt" maxWidth="300px" marginTop="64px">
        Contract execution in seconds instead of weeks.
      </Typo>
    </SlideContainer>
  );
};

export const Slide03: React.FC = () => (
  <SlideContainer>
    <Typo type="headline1">Powerful Customization</Typo>
    <CustomizationImg
      src={customizationCarousel}
      alt="Figure and Provenance Logos"
    />
    <Typo type="bodyAlt" maxWidth="300px" marginTop="40px">
      Fully control your wallet and crypto, and manage it independently.
    </Typo>
  </SlideContainer>
);
