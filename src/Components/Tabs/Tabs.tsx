import { Typo } from 'Components/Typo';
import styled from 'styled-components';
import { COLORS } from 'theme';

interface Props {
  tabs: string[];
  activeIndex?: number;
  setActiveIndex: (index: number) => void;
}

const TabsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
`;
const TabHeader = styled.div<{ active: boolean }>`
  border-bottom: 2px solid
    ${({ active }) => (active ? COLORS.WHITE : COLORS.NEUTRAL_600)};
  padding-bottom: 8px;
  margin-bottom: 30px;
  flex-basis: 50%;
  cursor: pointer;
`;

export const Tabs: React.FC<Props> = ({ tabs, activeIndex = 0, setActiveIndex }) => {
  return (
    <TabsContainer>
      {tabs.map((title, index) => (
        <TabHeader
          active={activeIndex === index}
          onClick={() => setActiveIndex(index)}
        >
          <Typo type="body" color={activeIndex === index ? 'WHITE' : 'NEUTRAL_200'}>
            {title}
          </Typo>
        </TabHeader>
      ))}
    </TabsContainer>
  );
};
