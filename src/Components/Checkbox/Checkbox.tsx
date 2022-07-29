import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme/colors';
import { keyPress } from 'utils';

interface StyledProps {
  disabled?: boolean;
}

const CheckboxContainer = styled.div<StyledProps>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;
const StyledCheckbox = styled.div<StyledProps>`
  height: 20px;
  width: 20px;
  border: 1px solid #498afd;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    position: absolute;
    z-index: 1;
  }
  &:disabled {
    user-select: none;
    cursor: not-allowed;
  }
`;
const Label = styled.label`
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
  flex-basis: 100%;
  margin-left: 20px;
`;

interface Props {
  checked?: boolean;
  onChange: (e: any) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<Props> = ({
  checked,
  onChange,
  label,
  className,
  disabled,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <CheckboxContainer className={className} disabled={disabled}>
      <StyledCheckbox
        onClick={handleClick}
        disabled={disabled}
        onKeyPress={(e) => keyPress(e, 'Enter', handleClick)}
        tabIndex={0}
      >
        {checked && <Sprite icon={ICON_NAMES.CHECK} size="1.2rem" color="#498AFD" />}
      </StyledCheckbox>
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};
