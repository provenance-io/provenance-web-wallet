import styled from 'styled-components';
import { useState } from 'react';
import { Content, Header, Sprite } from 'Components';
import { COLORS } from 'theme';
import { ICON_NAMES, TESTNET_NETWORK } from 'consts';
import { FaucetContent } from './FaucetContent';
import { PrintStorageData } from './PrintStorageData';
import { CustomGRPC } from './CustomGRPC';
import { useActiveAccount } from 'redux/hooks';

const SectionContent = styled.div`
  padding: 20px;
`;
const SectionOption = styled.div<{ active: boolean }>`
  border-bottom: 1px solid ${COLORS.NEUTRAL_600};
  font-weight: 400;
  transition: 250ms all;
  font-size: 1.4rem;
  ${({ active }) => active && `background: ${COLORS.NEUTRAL_700};`}
`;
const SectionTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  &:hover {
    background: ${COLORS.NEUTRAL_600};
  }
  &:active {
    background: ${COLORS.NEUTRAL_700};
  }
`;

export const AdvancedSettings: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { network } = useActiveAccount();

  const changeActiveIndex = (newValue: number) => {
    let finalValue = newValue;
    if (newValue === activeIndex) finalValue = -1;
    setActiveIndex(finalValue);
  };

  return (
    <Content>
      <Header title="Advanced Settings" />
      {network && network === TESTNET_NETWORK && (
        <SectionOption active={activeIndex === 0}>
          <SectionTitleRow onClick={() => changeActiveIndex(0)} tabIndex={0}>
            Faucet
            <Sprite
              icon={ICON_NAMES.CHEVRON}
              size="1.3rem"
              spin={activeIndex === 0 ? 90 : 0}
            />
          </SectionTitleRow>
          {activeIndex === 0 && (
            <SectionContent>
              <FaucetContent />
            </SectionContent>
          )}
        </SectionOption>
      )}
      <SectionOption active={activeIndex === 1}>
        <SectionTitleRow onClick={() => changeActiveIndex(1)} tabIndex={0}>
          Custom gRPC Service
          <Sprite
            icon={ICON_NAMES.CHEVRON}
            size="1.3rem"
            spin={activeIndex === 1 ? 90 : 0}
          />
        </SectionTitleRow>
        {activeIndex === 1 && (
          <SectionContent>
            <CustomGRPC />
          </SectionContent>
        )}
      </SectionOption>
      <SectionOption active={activeIndex === 2}>
        <SectionTitleRow onClick={() => changeActiveIndex(2)} tabIndex={0}>
          Print All Storage Data
          <Sprite
            icon={ICON_NAMES.CHEVRON}
            size="1.3rem"
            spin={activeIndex === 2 ? 90 : 0}
          />
        </SectionTitleRow>
        {activeIndex === 2 && (
          <SectionContent>
            <PrintStorageData />
          </SectionContent>
        )}
      </SectionOption>
    </Content>
  );
};
