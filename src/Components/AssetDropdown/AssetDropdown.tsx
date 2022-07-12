import { useState } from 'react';
import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { Asset } from 'types';

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

interface Props {
  assets: Asset[];
  className?: string;
  activeDenom?: string;
  onChange: (e: any) => void;
}

export const AssetDropdown: React.FC<Props> = ({
  className,
  assets,
  activeDenom = assets[0]?.denom,
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleAssetClick = (asset: Asset) => {
    // If open, close.  If closed, open.
    setDropdownOpen(!dropdownOpen);
    // If not already active, set to active
    onChange(asset);
  };
  const activeAsset = assets.find(({ denom }) => denom === activeDenom) || assets[0];

  const renderDropdown = (asset: Asset, option: boolean = false) => {
    const { denom, display, usdPrice, displayAmount, exponent } = asset;

    const price = (usdPrice / Number(`1e-${exponent}`)).toFixed(3);

    return (
      <AssetItem onClick={() => handleAssetClick(asset)} key={denom} option={option}>
        <Right>
          <AssetImg src={`/images/assets/${display}.svg`} />
          <AssetName>{display}</AssetName>
        </Right>
        <Left>
          <Amounts>
            <AssetValue>${price}</AssetValue>
            <AssetCount>
              {Number(displayAmount).toFixed(2)} {display}
            </AssetCount>
          </Amounts>
          {!option && assets.length > 1 && <Sprite icon={ICON_NAMES.CARET} size="1rem" />}
        </Left>
      </AssetItem>
    );
  };
  
  // Don't render the currently active dropdown in all options
  const renderAllDropdowns = () =>
    assets
      .filter((asset) => asset?.denom !== activeDenom)
      .map((asset) => renderDropdown(asset, true));

  return (
    <Wrapper className={className}>
      {!!activeAsset && renderDropdown(activeAsset)}
      {dropdownOpen && !!assets.length && <FloatingOptions>{renderAllDropdowns()}</FloatingOptions>}
    </Wrapper>
  );
};
