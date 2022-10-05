import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSavedData, getStorageData } from 'utils';
import { COLORS } from 'theme';
import { ScrollContainer } from 'Components';

const DataContainer = styled.div`
  background: ${COLORS.NEUTRAL_750};
  padding: 4px 8px;
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
    <ScrollContainer height="224px" paddingBottom="0px">
      <DataContainer>
        <pre>{JSON.stringify(allStorageData, null, 2)}</pre>
      </DataContainer>
    </ScrollContainer>
  );
};
