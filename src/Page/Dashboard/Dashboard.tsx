import { Button, ButtonGroup, FooterNav, AssetRow, Content, Denom } from 'Components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddress, useWallet } from 'redux/hooks';
import styled from 'styled-components';
import { DashboardHeader } from './DashboardHeader';

const PortfolioTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 40px;
  font-family: 'Gothic A1';
`;
const Value = styled.div`
  font-size: 4.4rem;
  font-weight: 300;
  line-height: 54px;
  letter-spacing: 0.02rem;
  margin-bottom: 20px;
`;
const AssetsTitle = styled.div`
  margin-top: 32px;
  padding-bottom: 12px;
  font-size: 1.8rem;
  font-family: 'Gothic A1';
  font-weight: 700;
  width: 100%;
`;
const AssetsContainer = styled.div`
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 80px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getAddressAssets, assets } = useAddress();
  const { activeWalletIndex, wallets } = useWallet();
  const activeWallet = wallets[activeWalletIndex];
  const { address } = activeWallet;

  // Onload get account assets
  useEffect(() => {
    if (address) getAddressAssets(address);
  }, [address, getAddressAssets]);

  const calculatePortfolioValue = () => {
    let totalValue = 0;
    const assetValues = assets.map(({ usdPrice, amount }) => usdPrice * Number(amount));
    assetValues.forEach((value) => { totalValue += value });
    return totalValue;
  };

  const renderAssets = () => assets.map(({ display, displayAmount }) => (
    <AssetRow
      onClick={() => navigate(`/asset/${display}`)}
      img={display}
      name={display}
      amount={{ count: displayAmount }}
      key={display}
    />
  ));

  return (
    <Content>
      <DashboardHeader />
      <PortfolioTitle>Portfolio Value</PortfolioTitle>
      <Value><Denom>$</Denom>{calculatePortfolioValue().toFixed(2)}</Value>
      <ButtonGroup layout="inline" direction="row">
        <Button layout="default" onClick={() => navigate('./send')}>Send</Button>
        <Button layout="default" onClick={() => navigate('./receive')}>Receive</Button>
      </ButtonGroup>
      <AssetsTitle>My Assets</AssetsTitle>
      <AssetsContainer>
        {assets.length ? renderAssets(): 'Address has no assets...'}
      </AssetsContainer>
      <FooterNav />
    </Content>
  );
};
