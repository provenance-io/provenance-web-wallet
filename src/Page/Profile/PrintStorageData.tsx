import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSavedData, getStorageData } from 'utils';
import { COLORS } from 'theme';

const DataContainer = styled.div`
  overflow-y: scroll;
  max-height: 276px;
  background: ${COLORS.NEUTRAL_750};
  padding: 4px 8px;
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

export const PrintStorageData: React.FC = () => {
  const [allStorageData, setAllStorageData] = useState({});

  useEffect(() => {
    // Pulling storage data is async and needs to happen when this component loads
    (async () => {
      // Not passing anything in will return all chrome storage data
      const chromeStorageData = await getSavedData();
      const localStorageData = await getStorageData();
      const fullStorageData = {
        chromeStorage: chromeStorageData,
        localStorage: localStorageData,
      };
      setAllStorageData(fullStorageData);
    })();
  }, []);

  return (
    <DataContainer>
      <pre>{JSON.stringify(allStorageData, null, 2)}</pre>
    </DataContainer>
  );
};
