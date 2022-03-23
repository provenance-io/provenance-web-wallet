import { useState } from 'react';
import { Button, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bg from '../bg.png';

const Wrapper = styled.div`
  padding: 225px 16px 42px 16px;
  background: url(${bg}) no-repeat;
  background-size: cover;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  align-items: center;
  text-align: center;
`;
const CarouselContent = styled.div`
  cursor: pointer;
  user-select: none;
`;
const Title = styled.div`
  margin-top: 40px;
  font-weight: 700;
  line-height: 2.6rem;
  font-size: 2rem; 
  letter-spacing: 1rem;
  text-transform: uppercase;
  font-family: 'Montserrat', 'sans-serif';
`;
const Text = styled.div`
  margin: 64px auto 0;
  font-size: 1.4rem;
  line-height: 2.2rem;
  max-width: 300px;
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

export const Landing:React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const navigate = useNavigate();

  const handleCreateWallet = () => {
    navigate('/create');
  };
  const handleSliderChange = () => {
    if (currentSlide < 3) setCurrentSlide(currentSlide + 1);
    else setCurrentSlide(1);
  };
  const renderCarouselContent = () => {
    switch (currentSlide) {
      case 1: return (
        <CarouselContent onClick={handleSliderChange}>
          <Sprite icon='ICON::PROVENANCE' size="6rem" color='#3F80F3' />
          <Title>Provenance Wallet</Title>
          <Text>A wallet provides an easy way to manage multiple blockchain accounts.</Text>
        </CarouselContent>
      )
      case 2: return (
        <CarouselContent onClick={handleSliderChange}>
          <Title>Strong Fundamentals</Title>
          <Text>Contract execution in seconds instead of weeks.</Text>
        </CarouselContent>
      )
      case 3: return (
        <CarouselContent onClick={handleSliderChange}>
          <Title>Powerful Customization</Title>
          <Text>Fully control your wallet and crypto, and manage it independently.</Text>
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
      <Button variant='primary' onClick={handleCreateWallet}>Create Wallet</Button>
      <TextButton>Recover Wallet</TextButton>
    </Wrapper>
  )
};
