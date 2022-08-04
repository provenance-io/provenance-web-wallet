import styled from 'styled-components';
import { COLORS } from 'theme';
import { keyPress } from 'utils';

interface StyledProps {
  active?: boolean;
  disabled?: boolean;
}

const PillContainer = styled.div`
  display: flex;
`;
const PillHalf = styled.div<StyledProps>`
  height: 26px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: ${({ active }) => (active ? COLORS.PRIMARY_500 : COLORS.NEUTRAL_650)};
  cursor: pointer;
  &:nth-child(1) {
    border-radius: 5px 0 0 5px;
    margin-right: 1px;
  }
  &:nth-child(2) {
    margin-left: 1px;
    border-radius: 0 5px 5px 0;
  }
  ${({ disabled }) =>
    disabled &&
    `
    filter: saturate(0);
    cursor: not-allowed;
  `}
`;
interface HalfProps {
  text: string;
  title?: string;
  onClick: (e: any) => void;
  active?: boolean;
}
type Side = 'left' | 'right';
interface Props {
  className?: string;
  data: {
    [key in Side]: HalfProps;
  };
  disabled?: boolean;
}

export const Pill: React.FC<Props> = ({ className, data, disabled }) => {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent, side: Side) => {
    if (!disabled) data[side].onClick(e);
  };

  const buildHalf = (side: Side) => (
    <PillHalf
      key={side}
      active={data[side].active}
      title={data[side].title}
      onClick={(e) => handleClick(e, side)}
      onKeyPress={(e) => keyPress(e, 'Enter', () => handleClick(e, side))}
      disabled={disabled}
      tabIndex={0}
    >
      {data[side].text}
    </PillHalf>
  );
  const buildPills = () => [buildHalf('left'), buildHalf('right')];

  return <PillContainer className={className}>{buildPills()}</PillContainer>;
};
