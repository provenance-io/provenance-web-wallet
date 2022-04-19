import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme/colors';

const CheckboxContainer = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
`;
const StyledCheckbox = styled.div`
  height: 20px;
  width: 20px;
  border: 1px solid #498AFD;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  flex-shrink: 0;
  svg {
    position: absolute;
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
  checked: boolean,
  onChange: (e: any) => void,
  label?: string,
}

export const Checkbox:React.FC<Props> = ({ checked = false, onChange, label }) => {
  return (
    <CheckboxContainer>
      <StyledCheckbox onClick={() => onChange(!checked)}>
        {checked && <Sprite icon={ICON_NAMES.CHECK} size="1.2rem" color="#498AFD" />}
      </StyledCheckbox>
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  )
};
