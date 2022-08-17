import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';

const Content = styled.div`
  position: relative;
  font-family: 'Gothic A1', sans-serif;
`;
const SelectStyled = styled.select`
  width: 100%;
  border: 1px solid ${COLORS.NEUTRAL_250};
  padding: 10px 12px;
  background: transparent;
  border-radius: 4px;
  font-size: 1.4rem;
  font-family: 'Gothic A1', sans-serif;
  color: ${COLORS.WHITE};
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
`;
const DropdownIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 34px;
  user-select: none;
  pointer-events: none;
`;
const OptionGroup = styled.optgroup`
  font-size: 1.4rem;
`;
const Label = styled.label`
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
`;

interface Props {
  options: string[];
  value: string | number;
  onChange: (e: any) => void;
  className?: string;
  label?: string;
}

export const Select: React.FC<Props> = ({
  options,
  label,
  onChange,
  className,
  value,
}) => {
  const renderOptions = () =>
    options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  const randomId = `${Math.floor(Math.random() * (10000 - 1 + 1) + 10000)}`;

  return (
    <Content className={className}>
      {label && <Label htmlFor={randomId}>{label}</Label>}
      <SelectStyled
        onChange={({ target }) => {
          onChange(target.value);
        }}
        value={value}
        id={randomId}
      >
        <OptionGroup>{renderOptions()}</OptionGroup>
      </SelectStyled>
      <DropdownIcon>
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" spin="90" />
      </DropdownIcon>
    </Content>
  );
};
