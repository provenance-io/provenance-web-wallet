import styled from 'styled-components';
import { COLORS } from 'theme/colors';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number,
  onChange?: (e: any) => void
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
  padding: 10px;
  border: 1px solid ${COLORS.NEUTRAL_300};
  border-radius: 4px;
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
  background: transparent;

  &::placeholder {
    color: ${COLORS.NEUTRAL_300};
  }
`;

export const Input = ({ id, label, type = 'text', value, onChange, ...rest }: InputProps) => (
  <InputGroup>
    <Label htmlFor={id}>{label}</Label>
    <InputEl
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </InputGroup>
);
