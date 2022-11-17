import { Sprite } from 'Components/Sprite';
import { ICON_NAMES } from 'consts';
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from 'theme';
import xMasJD2022 from './xMasJD2022.png';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  pointer-events: none;
  user-select: none;
`;
const RiseUpAnimation = keyframes`
  from {
    bottom: -300px;
  }
  to {
    bottom: -10px;
  }
`;
const SnowFallAnimation = keyframes`
  from {
    transform: translate3d(0vw, 0, 0);
  }
  to {
    transform: translate3d(0vw, 110vh, 0);
  }
`;
const FadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  10% { opacity: 0.2 }
  50% {
    opacity: 1;
  }
  90% { opacity: 0.2 }
  100% {
    opacity: 0;
  }
`;
const ImagePopup = styled.div`
  position: absolute;
  bottom: -300px;
  animation: 4s ${RiseUpAnimation};
  animation-fill-mode: forwards;
`;
const HappyHolidays = styled.div`
  position: absolute;
  left: 10px;
  opacity: 0;
  top: 280px;
  font-size: 37px;
  font-weight: bold;
  color: ${COLORS.PRIMARY_100};
  text-shadow: 2px 2px 2px red, 4px 4px 4px white, 6px 6px 6px red;
  animation: ${FadeInOut} 5s ease-in-out infinite;
  animation-fill-mode: both;
  transform: scale(1, 2);
`;

const Snowflake = styled(Sprite)`
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: 187px;
`;

const Snow = styled.div<{
  size: string;
  leftInit: string;
  leftEnd: string;
  left: string;
  speed: string;
  delay: string;
}>`
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  background: white;
  left: ${({ left }) => `${left}vw`};
  top: -5vh;
  animation-delay: ${({ delay }) => `-${delay}s`};
  animation-duration: ${({ speed }) => `${speed}s`};
  animation-iteration-count: infinite;
  animation-name: ${SnowFallAnimation};
  animation-timing-function: linear;

  // Blur every 6 flakes
  &:nth-child(6n) {
    filter: blur(1px);
  }
`;

export const HolidaySpecial: React.FC = () => {
  const [active, setActive] = useState(false);
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const [showSnowflake, setShowSnowflake] = useState(false);
  const snowflakeCount = 50;

  useEffect(() => {
    // Handle keypress
    const keyboardEvent = (event: KeyboardEvent) => {
      const { type, key } = event;
      // Clone and add key to keysPressed
      let newKeysPressed = [...keysPressed];
      // Add key
      if (type === 'keydown') newKeysPressed.push(key);
      // Remove all matching keys
      else if (type === 'keyup')
        newKeysPressed = newKeysPressed.filter(
          (previousPressed) => previousPressed !== key
        );
      // Save state
      setKeysPressed(newKeysPressed);
    };

    document.body.addEventListener('keydown', keyboardEvent);
    document.body.addEventListener('keyup', keyboardEvent);

    // On offload, remove event listeners
    return () => {
      document.body.removeEventListener('keydown', keyboardEvent);
      document.body.removeEventListener('keyup', keyboardEvent);
    };
  }, [keysPressed]);

  // Check for secret keypress
  useEffect(() => {
    if (
      keysPressed[0] === 'Shift' &&
      keysPressed[1] === 'J' &&
      keysPressed[2] === 'D'
    ) {
      setShowSnowflake(true);
    }
  }, [active, keysPressed]);

  const randomNumber = (min: number = 0, max: number) =>
    (Math.random() * (max - min + 1) + min).toPrecision(2);

  const createSnowflakes = () => {
    const allFlakes = [];
    for (let i = 0; i < snowflakeCount; i++) {
      const size = randomNumber(5, 10);
      const speed = randomNumber(5, 15);
      const delay = randomNumber(5, 15);
      const left = randomNumber(0, 100);
      const leftInit = randomNumber(-10, 10);
      const leftEnd = randomNumber(-10, 10);
      allFlakes.push(
        <Snow
          size={size}
          speed={speed}
          leftInit={leftInit}
          leftEnd={leftEnd}
          left={left}
          delay={delay}
          key={i}
        />
      );
    }
    return allFlakes;
  };

  const handleSnowflakeClick = () => {
    if (active) {
      setActive(false);
      setShowSnowflake(false);
    } else {
      setActive(true);
    }
  };

  return (
    <>
      {active ? (
        <Container>
          {active}
          <HappyHolidays>HAPPY HOLIDAYS</HappyHolidays>
          <ImagePopup>
            <img src={xMasJD2022} alt="Happy Holidays" />
          </ImagePopup>
          {createSnowflakes()}
        </Container>
      ) : null}
      {showSnowflake ? (
        <Snowflake
          icon={ICON_NAMES.SNOWFLAKE}
          color={COLORS.WHITE_40}
          size="2rem"
          onClick={handleSnowflakeClick}
        />
      ) : null}
    </>
  );
};
