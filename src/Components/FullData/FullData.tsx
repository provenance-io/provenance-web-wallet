import { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { Sprite } from '../Sprite/Sprite';
import { ICON_NAMES } from 'consts';

const DataButton = styled.div`
  position: fixed;
  top: 34px;
  right: 20px;
  cursor: pointer;
  color: ${COLORS.PRIMARY_500};
  font-size: 1.4rem;
`;
const DataOverlay = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.BACKGROUND_1};
  color: ${COLORS.PRIMARY_400};
  padding: 40px 20px 20px 20px;
`;
const CloseIcon = styled(Sprite)`
  position: absolute;
  top: 40px;
  right: 40px;
  cursor: pointer;
`;
const DataContent = styled.div`
  background: ${COLORS.NEUTRAL_600};
  border-radius: 5px;
  width: 100%;
  height: 90%;
  padding: 12px;
  color: ${COLORS.PRIMARY_400};
  margin-top: 30px;
  word-break: break-all;
  overflow-y: scroll;
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
  data: {
    [key: string]: string | number | object | undefined;
  }
  title?: string,
}

export const FullData:React.FC<Props> = ({ data, title = 'Full Data JSON' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return isOpen ? (
    <DataOverlay>
      {title}
      <CloseIcon icon={ICON_NAMES.CLOSE} size="1.4rem" color={COLORS.PRIMARY_400} onClick={toggleOpen} />
      <DataContent>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </DataContent>
    </DataOverlay>
   ) : (
    <DataButton onClick={toggleOpen}>Data</DataButton>
   );
};
