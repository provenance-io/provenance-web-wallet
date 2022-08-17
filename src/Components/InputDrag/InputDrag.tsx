import { Typo } from '../Typo/Typo';
import styled from 'styled-components';
import { COLORS } from 'theme';

const InputDragContainer = styled.div`
  display: flex;
  position: relative;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  padding: 10px;
`;
const CurrentValueRow = styled.div`
  position: absolute;
  top: -40px;
  padding-left: 27px;
  left: 0;
  z-index: 15;
  width: 100%;
  text-align: left;
`;
const CurrentValue = styled.div<{ left: string; isDefault: boolean }>`
  // This is tricky, css positions based on the top-left so we need to align that position to the middle
  left: ${({ left, isDefault }) =>
    `calc(${left}% - ${isDefault ? '62px' : '42px'})`};
  padding: 4px 12px;
  font-size: 1.4rem;
  border-radius: 4px;
  background: ${COLORS.SECONDARY_350};
  text-align: center;
  display: inline-block;
  position: relative;
`;
const CurrentValueArrow = styled.div`
  position: absolute;
  bottom: -6px;
  left: 36%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid ${COLORS.SECONDARY_350};
`;
const SliderContainer = styled.div`
  flex-grow: 1;
  margin: 0 10px;
  position: relative;
`;
const SliderRangeInput = styled.input<{ bgSize: string }>`
  width: 100%;
  margin-bottom: 10px;
  height: 4px;
  border-radius: 4px;
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: ${COLORS.NEUTRAL_700};
  background-image: linear-gradient(
    ${COLORS.SECONDARY_350},
    ${COLORS.SECONDARY_350}
  );
  background-size: ${({ bgSize }) => bgSize};
  background-repeat: no-repeat;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 28px;
    width: 28px;
    border: 4px solid ${COLORS.SECONDARY_350};
    background: ${COLORS.WHITE};
    border-radius: 100%;
    margin-top: -12px;
    cursor: ew-resize;
  }
  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    width: 100%;
    cursor: grab;
    border-radius: 4px;
    height: 4px;
    background: transparent;
  }
`;

interface Props {
  value: string;
  defaultValue?: string;
  min?: string;
  max: string;
  step?: string;
  id?: string;
  onChange: (newValue: string) => void;
  default?: string;
}

// Note: This whole component will need to be thoroughly tested when using other browsers
// There are lots of browser specific stylings in here
export const InputDrag: React.FC<Props> = ({
  value,
  defaultValue,
  min = '0',
  max,
  step = '0.25',
  id = 'inputDrag',
  onChange,
}) => {
  const difference = Number(value) - Number(min);
  const sliderPositionPercent = Math.floor((difference / Number(max)) * 100);
  // const currentValueLeftPosition

  const handleInputChange = (value: string) => {
    const finalValue = Number(value).toFixed(2);
    onChange(finalValue);
  };

  const RangeInputBackgroundSize =
    ((Number(value) - Number(min)) * 100) / (Number(max) - Number(min)) + '% 100%';
  const isDefaultValue = value === defaultValue;

  return (
    <InputDragContainer>
      <Typo type="body" bold>
        {min}
      </Typo>
      <SliderContainer>
        <CurrentValueRow>
          <CurrentValue left={`${sliderPositionPercent}`} isDefault={isDefaultValue}>
            <Typo type="footnote" color="SECONDARY_700" bold>
              {value} {isDefaultValue && '(default)'}
            </Typo>
            <CurrentValueArrow />
          </CurrentValue>
        </CurrentValueRow>
        <SliderRangeInput
          bgSize={RangeInputBackgroundSize}
          type="range"
          min={min}
          max={max}
          step={step}
          id={id}
          onChange={(e) => handleInputChange(e.target.value)}
          value={value}
        />
      </SliderContainer>
      <Typo type="body" bold>
        {max}
      </Typo>
    </InputDragContainer>
  );
};
