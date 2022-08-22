import {
  Button,
  ButtonGroup,
  FooterNav,
  RowItem,
  Content,
  Loading,
  ScrollContainer,
} from 'Components';
import {
  SEND_URL,
  DASHBOARD_RECEIVE_URL,
  ICON_NAMES,
  ASSET_IMAGE_NAMES,
} from 'consts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddress, useActiveAccount } from 'redux/hooks';
import styled from 'styled-components';
import { DashboardHeader } from './DashboardHeader';
import { capitalize, currencyFormat } from 'utils';

const PortfolioTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 40px;
  font-family: 'Gothic A1';
`;
const Denom = styled.span`
  font-size: 2rem;
  margin-right: 4px;
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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getAddressAssets, assets, assetsLoading } = useAddress();
  const activeAccount = useActiveAccount();
  const { address } = activeAccount;

  // Onload get account assets
  useEffect(() => {
    if (address) getAddressAssets(address);
  }, [address, getAddressAssets]);

  const calculatePortfolioValue = () => {
    let totalValue = 0;
    const assetValues = assets.map(
      ({ usdPrice, amount }) => usdPrice * Number(amount)
    );
    assetValues.forEach((value) => {
      totalValue += value;
    });
    return currencyFormat(totalValue);
  };

  const renderAssets = () =>
    assets.map(({ display, displayAmount, amount, usdPrice }) => {
      const assetIconName =
        display && ASSET_IMAGE_NAMES.includes(display) ? display : 'provenance';
      return (
        <RowItem
          onClick={() => navigate(`/asset/${display}`)}
          img={assetIconName}
          title={capitalize(display, 'uppercase')}
          subtitle={currencyFormat(Number(amount) * usdPrice, '$')}
          key={display}
          detailsTop={Number(displayAmount).toFixed(5)}
        />
      );
    });

  return (
    <Content>
      <DashboardHeader />
      <PortfolioTitle>Portfolio Value</PortfolioTitle>
      <Value>
        <Denom>$</Denom>
        {assetsLoading ? <Loading /> : calculatePortfolioValue()}
      </Value>
      <ButtonGroup direction="row">
        <Button
          icon={ICON_NAMES.ARROW}
          iconLocation="top"
          iconGap="6px"
          iconProps={{ spin: 90 }}
          onClick={() => navigate(SEND_URL)}
        >
          Send
        </Button>
        <Button
          icon={ICON_NAMES.ARROW}
          iconLocation="top"
          iconGap="6px"
          iconProps={{ spin: -90 }}
          onClick={() => navigate(DASHBOARD_RECEIVE_URL)}
        >
          Receive
        </Button>
      </ButtonGroup>
      <AssetsTitle>My Assets</AssetsTitle>
      <ScrollContainer height="166px">
        {assetsLoading ? (
          <Loading />
        ) : assets.length ? (
          renderAssets()
        ) : (
          'Address has no assets...'
        )}
      </ScrollContainer>
      <FooterNav />
    </Content>
  );
};
