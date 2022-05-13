import { useState } from 'react';
import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;
const AssetItem = styled.div<{option: boolean}>`
  border: 1px solid #A2A7B9;
  border-radius: ${({ option }) => option ? '0px' : '4px' };
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ option }) => option ? '#2C2F3A' : '#1B1E29' };
  cursor: pointer;
  width: 100%;
  user-select: none;
  &:hover {
    ${({ option }) => option && 'background: #3D3F4B;'};
  }
`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const AssetImg = styled.img`
  margin-right: 8px;
  width: 30px;
`;
const AssetName = styled.div``;
const Amounts = styled.div`
  text-align: right;
  margin-right: 24px;
`;
const AssetValue = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 1.4rem;
`;
const AssetCount = styled.div`
  font-weight: 400;
  font-size: 1.2rem;
  color: #A2A7B9;
`;
const FloatingOptions = styled.div`
  position: absolute;
  top: 70px;
  top: 70px;
  left: 0;
  z-index: 100;
  width: 100%;
`;


interface Asset {
  icon: string,
  name: string,
  value: number,
  amount: number,
  id: number|string,
};
interface Props {
  assets: Asset[],
  className?: string,
  activeID: number|string,
  onChange: (e: any) => void,
}

export const AssetDropdown:React.FC<Props> = ({ className, assets, activeID=assets[0].id, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleAssetClick = (id: string|number) => {
    // If open, close.  If closed, open.
    setDropdownOpen(!dropdownOpen);
    // If not already active, set to active
    onChange(id);
  };
  const activeAsset = assets.find(({ id }) => id === activeID) || assets[0];

  // TODO: Need to make sure all currency and number values get the proper sig figs and currency icon
  const renderDropdown = ({ id, icon, name, value, amount }: Asset, option: boolean = false) => (
    <AssetItem onClick={() => handleAssetClick(id)} key={id} option={option}>
      <Right>
        <AssetImg src={`/images/assets/${icon}.svg`} />
        <AssetName>{name}</AssetName>
      </Right>
      <Left>
        <Amounts>
          <AssetValue>${value}</AssetValue>
          <AssetCount>{amount} {name}</AssetCount>
        </Amounts>
        {!option && <Sprite icon={ICON_NAMES.CARET} size="1rem" />}
      </Left>
    </AssetItem>
  );
  
  // Don't render the currently active dropdown in all options
  const renderAllDropdowns = () => assets.filter((asset) => asset.id !== activeID).map((asset) => renderDropdown(asset, true));

  return (
    <Wrapper className={className}>
      {renderDropdown(activeAsset)}
      {dropdownOpen && <FloatingOptions>{renderAllDropdowns()}</FloatingOptions>}
    </Wrapper>
  );
};
