import styled from 'styled-components';
import { COLORS } from 'theme';

const ScrollArea = styled.div<{
  height: string;
  wordBreak: string;
  paddingBottom: string;
  backgroundColor?: string;
}>`
  width: 100%;
  max-height: ${({ height }) => height};
  word-break: ${({ wordBreak }) => wordBreak};
  overflow-y: auto;
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
  ${({ backgroundColor }) =>
    backgroundColor ? `background: ${backgroundColor};` : ''}
  // Attempt to style the scrollbar
  &::-webkit-scrollbar-thumb {
    background-color: ${COLORS.PRIMARY_500};
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px ${COLORS.PRIMARY_600};
  }
  &::-webkit-scrollbar {
    width: 2px;
  }
`;

interface Props {
  height?: string;
  wordBreak?: string;
  children: React.ReactNode;
  paddingBottom?: string;
  backgroundColor?: string;
}

export const ScrollContainer: React.FC<Props> = ({
  height = '300px',
  wordBreak = 'normal',
  paddingBottom = '30px',
  children,
  backgroundColor,
}) => {
  return (
    <ScrollArea
      height={height}
      wordBreak={wordBreak}
      paddingBottom={paddingBottom}
      backgroundColor={backgroundColor}
    >
      {children}
    </ScrollArea>
  );
};
