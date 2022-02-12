import { useRef } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme/colors';

interface InputProps {
  checked?: boolean;
  id: string;
  label: string;
  onChange: () => void;
  type?: string;
}

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
`;

const InputEl = styled.input`
  display: none;
`;

const CheckboxEl = styled.div<{
  checked?: boolean;
}>`
  height: 20px;
  width: 20px;
  background: transparent;
  border: 1px solid ${COLORS.PRIMARY_500};
  border-radius: 2px;
  cursor: pointer;

  &:hover,
  &:active {
    border-color: ${COLORS.WHITE};
    border-size: ${({ checked }) => (checked ? 2 : 1)}px;
    box-shadow: ${({ checked }) => !checked && `0 0 4px 5px ${COLORS.NEUTRAL_550}`};
  }
`;

export const Checkbox = ({ id, label, onChange, ...rest }: InputProps) => {
  const handleChange = ({ target: { value } }: { target: { value: string } }) => {
    if (onChange) {
      onChange();
    }

    console.log(value);
  };

  return (
    <InputGroup>
      <InputEl id={id} type="checkbox" onChange={handleChange} {...rest} />
      <CheckboxEl {...rest} onClick={() => {}} />
      <Label htmlFor={id}>{label}</Label>
    </InputGroup>
  );
};
