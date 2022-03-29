import { useEffect, useState } from 'react';
import { Button, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bg from '../bg.png';
import customizationCarousel from 'images/customization-carousel.svg';
import { STATISTICS_URL } from 'consts';
import { numberFormat } from 'utils';
import { Title, InfoText } from 'Components';

const Wrapper = styled.div`
  padding: 42px 16px;
  background: url(${bg}) no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'Montserrat', 'sans-serif';
  box-sizing: border-box;
  justify-content: flex-end;
`;
const CarouselContent = styled.div`
  cursor: pointer;
  user-select: none;
`;
const SliderControls = styled.div`
  margin-top: 102px;
  margin-bottom: 32px;
  display: flex;
`;
const Slider = styled.div<{active: boolean}>`
  height: 4px;
  width: 30px;
  background: ${({ active }) => active ? '#F3F4F6' : '#8B90A7' };
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
`;
const TextButton = styled.a`
  color: white;
  font-size: 1.4rem;
  margin-top: 32px;
  cursor: pointer;
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

interface Stats {
  marketCap?: number,
  validators?: number,
  transactions?: number,
  averageBlockTime?: number,
}

export const Landing:React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [stats, setStats] = useState<Stats>({}); // { marketCap, validators, transactions, averageBlockTime }
  const { marketCap, validators, transactions, averageBlockTime } = stats;
  const navigate = useNavigate();
  // On load, pull latest stats (not needed in rest of app so keeping out of redux for now)
  useEffect(() => {
    window.fetch(STATISTICS_URL)
    .then(response => response.json())
    .then(data => { setStats(data); })
  }, []);

  const changePage = (location: string) => {
    navigate(`/${location}`);
  };
  const handleSliderChange = () => {
    if (currentSlide < 3) setCurrentSlide(currentSlide + 1);
    else setCurrentSlide(1);
  };
  const formatNumber = (value: number, digits = 1) => numberFormat({ rawValue: value, digits, extraOptions: { shorthand: true } });
  const valueText = (value?: string | number, text?: string | number, position: 'front' | 'back' = 'front') => (
    <>
      {position === 'front' && <StatValueSmall>{text}</StatValueSmall>}
      {value}
      {position === 'back' && <StatValueSmall>{text}</StatValueSmall>}
    </>
  );
  const renderCarouselContent = () => {
    switch (currentSlide) {
      case 1: return (
        <CarouselContent onClick={handleSliderChange}>
          <Sprite icon='ICON::PROVENANCE' size="6rem" color='#3F80F3' />
          <Title>Provenance Wallet</Title>
          <InfoText>A wallet provides an easy way to manage multiple blockchain accounts.</InfoText>
        </CarouselContent>
      )
      case 2: return (
        <CarouselContent onClick={handleSliderChange}>
          <Title>Strong Fundamentals</Title>
          <StatsSection>
            <StatItem>
              <StatValue>{marketCap ? valueText(formatNumber(marketCap), '$') : 'N/A'}</StatValue>
              <StatTitle>Market Cap</StatTitle>
            </StatItem>
            <StatItem>
              <StatValue>{validators || 'N/A'}</StatValue>
              <StatTitle>Validators</StatTitle>
            </StatItem>
            <StatItem>
              <StatValue>{transactions ? formatNumber(transactions, 2) : 'N/A'}</StatValue>
              <StatTitle>Transactions</StatTitle>
            </StatItem>
            <StatItem>
              <StatValue>{averageBlockTime ? valueText(formatNumber(averageBlockTime, 3), 'sec', 'back') : 'N/A'}</StatValue>
              <StatTitle>Avg Block Time</StatTitle>
            </StatItem>
          </StatsSection>
          <InfoText>Contract execution in seconds instead of weeks.</InfoText>
        </CarouselContent>
      )
      case 3: return (
        <CarouselContent onClick={handleSliderChange}>
          <Title>Powerful Customization</Title>
          <CustomizationImg src={customizationCarousel} alt="Figure and Provenance Logos" />
          <InfoText>Fully control your wallet and crypto, and manage it independently.</InfoText>
        </CarouselContent>
      )
      default: return null;
    }
  };
  return (
    <Wrapper>
      {renderCarouselContent()}
      <SliderControls>
        <Slider active={currentSlide === 1} onClick={() => setCurrentSlide(1)} />
        <Slider active={currentSlide === 2} onClick={() => setCurrentSlide(2)} />
        <Slider active={currentSlide === 3} onClick={() => setCurrentSlide(3)} />
      </SliderControls>
      <Button variant='primary' onClick={() => changePage('create')}>Create Wallet</Button>
      <TextButton onClick={() => changePage('recover')}>Recover Wallet</TextButton>
    </Wrapper>
  )
};
