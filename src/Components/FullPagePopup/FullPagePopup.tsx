import styled from 'styled-components';
import { COLORS } from 'theme';
import { Sprite } from '../Sprite/Sprite';
import { ICON_NAMES } from 'consts';

const PopupOverlay = styled.div`
  position: fixed;
  z-index: 300;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.BACKGROUND_1};
  color: ${COLORS.PRIMARY_400};
  padding: 40px 20px 20px 20px;
`;
const PopupContent = styled.div<{ height: string; wordBreak: string }>`
  background: ${COLORS.NEUTRAL_600};
  border-radius: 5px;
  width: 100%;
  height: ${({ height }) => height};
  padding: 12px;
  color: ${COLORS.PRIMARY_400};
  margin-top: 30px;
  word-break: ${({ wordBreak }) => wordBreak};
  /* overflow-y: scroll; */
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
const CloseIcon = styled(Sprite)`
  position: absolute;
  top: 40px;
  right: 40px;
  cursor: pointer;
`;

interface Props {
  children: React.ReactNode;
  close: () => void;
  title?: string;
  height?: string;
  wordBreak?: string;
}

export const FullPagePopup: React.FC<Props> = ({
  children,
  close,
  title,
  height = '90%',
  wordBreak = 'break-all',
}) => {
  return (
    <PopupOverlay>
      {title}
      <CloseIcon
        icon={ICON_NAMES.CLOSE}
        size="1.4rem"
        color={COLORS.PRIMARY_400}
        onClick={close}
      />
      <PopupContent height={height} wordBreak={wordBreak}>
        {children}
      </PopupContent>
    </PopupOverlay>
  );
};
