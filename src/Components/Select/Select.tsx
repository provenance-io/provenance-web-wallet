import styled from 'styled-components';

const SelectStyled = styled.select`
  width: 100%;
  border: 1px solid #A2A7B9;
  padding: 10px 12px;
  background: transparent;
  border-radius: 4px;
  font-size: 1.4rem;
  font-family: 'Gothic A1', sans-serif;
  color: #FFFFFF;
`;
const OptionGroup = styled.optgroup`
  font-size: 1.4rem;
`;

interface Props {
  options: string[],
  selected: string | number,
  onChange: (e: any) => void,
  className?: string,
}

export const Select:React.FC<Props> = ({
  options,
  selected,
  onChange,
  className,
}) => {

  const renderOptions = () => options.map((option) => (
    <option key={option} value={option} selected={selected === option}>{option}</option>
  ));

  return (
    <SelectStyled onChange={onChange} className={className}>
      <OptionGroup>
        {renderOptions()}
      </OptionGroup>
    </SelectStyled>
  );
};
