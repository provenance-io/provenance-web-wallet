import { ScrollContainer } from 'Components/ScrollContainer';
import { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { FullPagePopup } from '../FullPagePopup/FullPagePopup';

const DataButton = styled.div`
  position: fixed;
  top: 34px;
  right: 20px;
  cursor: pointer;
  color: ${COLORS.PRIMARY_500};
  font-size: 1.4rem;
  z-index: 50;
`;

interface Props {
  data: {
    [key: string]: string | number | object | undefined;
  };
  title?: string;
}

export const FullData: React.FC<Props> = ({ data, title = 'Full Data JSON' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return isOpen ? (
    <FullPagePopup title={title} close={toggleOpen}>
      <ScrollContainer height="460px">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </ScrollContainer>
    </FullPagePopup>
  ) : (
    <DataButton onClick={toggleOpen}>Data</DataButton>
  );
};
