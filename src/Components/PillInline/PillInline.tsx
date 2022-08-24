import { Typo } from 'Components/Typo';
import styled from 'styled-components';
import { COLORS } from 'theme';

type Type = 'primary' | 'secondary' | 'tertiary';

const getTypeStyling = (type: Type) => {
  switch (type) {
    case 'primary':
      return `
        background: ${COLORS.SECONDARY_700};
        color: ${COLORS.SECONDARY_350};
      `;
    case 'secondary':
      return `
        background: ${COLORS.TRANSPARENT};
        color: ${COLORS.SECONDARY_350};
        border: 1px solid ${COLORS.SECONDARY_700};
      `;
    case 'tertiary':
      return `
        background: ${COLORS.TRANSPARENT};
        color: ${COLORS.SECONDARY_400};
        border: 1px solid ${COLORS.SECONDARY_400};
      `;
  }
};

const Pill = styled.div<{ type: Type; active: boolean }>`
  font-size: 1rem;
  height: 26px;
  border-radius: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  min-width: 70px;
  ${({ type }) => getTypeStyling(type)}
  ${({ active }) => !active && 'filter: brightness(2) saturate(0.2);'}
`;

interface Props {
  type?: Type;
  title: string;
  active?: boolean;
  className?: string;
}

export const PillInline: React.FC<Props> = ({
  type = 'primary',
  title,
  active = false,
  className,
}) => {
  return (
    <Pill type={type} active={active} className={className}>
      <Typo type="footnote" color="INHERIT">
        {title}
      </Typo>
    </Pill>
  );
};
