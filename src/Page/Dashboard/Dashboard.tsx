import {
  Button,
  ButtonGroup,
  FooterNav,
  RowItem,
  Content,
  Loading,
  ScrollContainer,
  Typo,
} from 'Components';
import {
  SEND_URL,
  DASHBOARD_RECEIVE_URL,
  ICON_NAMES,
  ASSET_IMAGE_NAMES,
} from 'consts';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount } from 'redux/hooks';
import styled from 'styled-components';
import { DashboardHeader } from './DashboardHeader';
import { capitalize, currencyFormat } from 'utils';
import { useGetAssetsQuery } from 'redux/services';

const Denom = styled.span`
  font-size: 2rem;
  margin-right: 4px;
`;

export const Dashboard = () => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const { address } = activeAccount;
  const {
    data: assets = [],
    error,
    isLoading,
  } = useGetAssetsQuery(address!, { refetchOnMountOrArgChange: 30 });

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

  const renderAssets = () => {
    const orderedAssets = [...assets].sort((a, b) =>
      a.display === 'hash' ? -1 : a.display > b.display ? 1 : -1
    );
    return orderedAssets.map(({ display, displayAmount, amount, usdPrice }) => {
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
  };

  return (
    <Content>
      <DashboardHeader />
      <Typo marginTop="40px" type="title" align="left">
        Portfolio Value
      </Typo>
      {isLoading ? (
        <Loading height="75px" />
      ) : (
        <Typo type="display1" align="left" marginBottom="10px">
          <Denom>$</Denom>
          {calculatePortfolioValue()}
        </Typo>
      )}
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
      <Typo type="subhead" align="left" marginBottom="12px" marginTop="26px">
        My Assets
      </Typo>
      <ScrollContainer height="166px">
        {isLoading ? (
          <Loading />
        ) : error ? (
          'Failed to lookup account assets'
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
