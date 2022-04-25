import styled from 'styled-components';
import { COLORS } from 'theme/colors';

interface InputProps {
  id: string;
  label?: string;
  disabled?: boolean,
  type?: string;
  placeholder?: string;
  value?: string | number,
  error?: string,
  children?: React.ReactNode;
  onChange?: (e: any) => void
}

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Gothic A1', sans-serif;
  position: relative;
`;

const Label = styled.label`
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
`;

const InputEl = styled.input<{error?: string}>`
  padding: 10px;
  border: 1px solid ${({ error }) => error ? COLORS.NEGATIVE_300 : COLORS.NEUTRAL_300 };
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

const Error = styled.div`
  color: ${COLORS.NEGATIVE_300};
  font-size: 1.2rem;
  column-gap: 1px;
`;

export const Input = ({
  id,
  label,
  type = 'text',
  value,
  error,
  disabled,
  onChange,
  children,
  ...rest
}: InputProps) => (
  <InputGroup>
    {label && <Label htmlFor={id}>{label}</Label>}
    {error && <Error>{error}</Error>}
    <InputEl
      id={id}
      type={type}
      value={value}
      onChange={(event) => (event?.target && onChange) && onChange(event.target.value)}
      error={error}
      disabled={disabled}
      autoComplete="off"
      {...rest}
    />
    {children}
  </InputGroup>
);
