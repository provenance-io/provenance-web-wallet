import styled from 'styled-components';
import { COLORS } from 'theme/colors';

interface InputProps {
  autoFocus?: boolean;
  background?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  error?: string;
  id: string;
  label?: string;
  onChange?: (e: any) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  type?: string;
  value?: string | number;
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
  text-transform: capitalize;
`;

const InputEl = styled.input<{ error?: string; background?: string }>`
  padding: 10px;
  border: 1px solid
    ${({ error }) => (error ? COLORS.NEGATIVE_300 : COLORS.NEUTRAL_300)};
  border-radius: 4px;
  color: ${COLORS.WHITE};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2.24rem;
  background: ${({ background }) => (background ? background : 'transparent')};

  &::placeholder {
    color: ${COLORS.NEUTRAL_300};
  }
  &:focus {
    outline-color: ${COLORS.PRIMARY_550};
    outline-offset: -1px;
    outline-width: 1px;
    outline-style: solid;
  }
`;

const InputError = styled.div<{ hasLabel?: boolean }>`
  color: ${COLORS.NEGATIVE_300};
  column-gap: 1px;
  font-size: 1.2rem;
  position: absolute;
  right: 3px;
  top: ${({ hasLabel }) => (hasLabel ? '20px' : '-12px')};
`;

export const Input = ({
  autoFocus,
  background,
  children,
  disabled,
  error,
  id,
  label,
  onChange,
  onKeyPress,
  type = 'text',
  value,
  ...rest
}: InputProps) => (
  <InputGroup>
    {label && <Label htmlFor={id}>{label}</Label>}
    {error && <InputError hasLabel={!!label}>{error}</InputError>}
    <InputEl
      id={id}
      type={type}
      value={value}
      onChange={(event) => event?.target && onChange && onChange(event.target.value)}
      error={error}
      disabled={disabled}
      autoComplete="off"
      background={background}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      {...rest}
    />
    {children}
  </InputGroup>
);
