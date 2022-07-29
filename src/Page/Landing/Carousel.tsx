import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useStatistics } from 'redux/hooks';
import { Slide01, Slide02, Slide03 } from './CarouselSlides';

const CarouselContent = styled.div`
  cursor: pointer;
  user-select: none;
  max-width: 100%;
  margin-top: 20px;
  overflow: hidden;
`;
const SliderControls = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;
const Slider = styled.div<{ active: boolean }>`
  height: 4px;
  width: 30px;
  background: ${({ active }) => (active ? '#F3F4F6' : '#8B90A7')};
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
`;
const AllSlides = styled.div<{ right: number; quickSwitch: boolean }>`
  display: flex;
  overflow: visible;
  align-items: flex-start;
  position: relative;
  right: ${({ right }) => `${right}px`};
  will-change: right;
  top: 0;
  ${({ quickSwitch }) => !quickSwitch && 'transition: 2s all ease-out;'}
`;

export const Carousel: React.FC = () => {
  // Total number of slides
  const slideCount = 4;
  const slideWidth = 350;
  // How long before switching to a new slide
  const slideTransition = 7000;
  const [currentSlide, setCurrentSlide] = useState(1);
  const currentSlideRef = useRef(currentSlide);
  const [slideTimeout, setSlideTimeout] = useState(0);
  const [sliderClickTimeout, setSliderClickTimeout] = useState(0);
  const { getStatistics, statistics } = useStatistics();

  const changeSlide = useCallback(
    (direct?: number) => {
      const latestCurrentSlide = currentSlideRef.current;
      const newSlide =
        direct || (latestCurrentSlide < slideCount ? latestCurrentSlide + 1 : 1);
      // Reset timer to auto-change slide
      // Change slide
      setCurrentSlide(newSlide);
      currentSlideRef.current = newSlide;
      // Kill existing slideTimeout
      clearTimeout(slideTimeout);
      // Start new timer
      const newSlideTimeout = window.setTimeout(
        () => {
          changeSlide();
        },
        latestCurrentSlide === slideCount ? -1 : slideTransition
      ); // If we are looping, instantly go back to slide 1;
      // Save timer to state
      setSlideTimeout(newSlideTimeout);

      // Kill any existing timers when changing page (no mem-leaks)
      return () => {
        clearTimeout(slideTimeout);
      };
    },
    [currentSlideRef, slideTimeout]
  );

  // Start auto-change slide timer
  useEffect(() => {
    // If no timeout has started, start one
    if (!slideTimeout) {
      const newSlideTimeout = window.setTimeout(() => {
        changeSlide();
      }, slideTransition);
      setSlideTimeout(newSlideTimeout);
    }
    // Kill any existing timers when changing page (no mem-leaks)
    return () => {
      clearTimeout(slideTimeout);
    };
  }, [changeSlide, slideTimeout]);
  // Pull stats from API
  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  const sliderClick = (event: React.MouseEvent, slideNo?: number) => {
    event.stopPropagation();
    // Only allow clicking the slide if previous click is finished
    if (!sliderClickTimeout) {
      const newSlideClickTimeout = window.setTimeout(() => {
        // Clear timeout
        setSliderClickTimeout(0);
      }, 2000);
      setSliderClickTimeout(newSlideClickTimeout);
      changeSlide(slideNo);
    }
  };

  return (
    <CarouselContent onClick={(e) => sliderClick(e)}>
      <AllSlides
        right={(currentSlide - 1) * slideWidth}
        quickSwitch={currentSlide === 1}
      >
        <Slide01 />
        <Slide02 statistics={statistics} />
        <Slide03 />
        <Slide01 />
      </AllSlides>
      <SliderControls>
        <Slider
          active={currentSlide === 1 || currentSlide === slideCount}
          onClick={(event) => sliderClick(event, 1)}
        />
        <Slider
          active={currentSlide === 2}
          onClick={(event) => sliderClick(event, 2)}
        />
        <Slider
          active={currentSlide === 3}
          onClick={(event) => sliderClick(event, 3)}
        />
      </SliderControls>
    </CarouselContent>
  );
};
