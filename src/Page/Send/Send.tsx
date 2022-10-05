import { useState, useEffect } from 'react';
import {
  Header,
  AssetDropdown,
  Input,
  Sprite,
  Button,
  Content,
  BottomFloat,
  Loading,
  Typo,
  ScrollContainer,
} from 'Components';
import styled from 'styled-components';
import { DASHBOARD_URL, ICON_NAMES, SEND_AMOUNT_URL } from 'consts';
import { keyPress, trimAddress, validateAddress } from 'utils';
import { useNavigate } from 'react-router';
import { useActiveAccount, useMessage } from 'redux/hooks';
import { COLORS } from 'theme';
import { useGetAssetsQuery, useGetTransactionsQuery } from 'redux/services';

const SectionTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  text-align: left;
  margin-bottom: 16px;
  &:not(:first-of-type) {
    margin-top: 32px;
  }
`;
const RecentAddressSection = styled.div`
  max-height: 210px;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
const RecentAddressItem = styled.div`
  display: flex;
  text-align: left;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  cursor: pointer;
  transition: 250ms all;
  &:hover {
    background: ${COLORS.NEUTRAL_700};
  }
`;
const AddressInfo = styled.div`
  font-weight: 400;
  display: flex;
  flex-direction: column;
`;
const Address = styled.div`
  font-size: 1.4rem;
  margin-bottom: 6px;
`;

export const Send: React.FC = () => {
  const [error, setError] = useState('');
  const [recentAddressLimit, setRecentAddressLimit] = useState(3);
  const [filteredTxs, setFilteredTxs] = useState<string[]>([]);
  const navigate = useNavigate();
  const { address } = useActiveAccount();
  // How many recent transactions should we comb through?
  const fetchTxsCount = 20;
  // Fetch Transactions
  const {
    data: txData,
    error: txApiError,
    isLoading: txApiLoading,
    isFetching: txApiFetching,
  } = useGetTransactionsQuery({
    address: address!,
    count: fetchTxsCount,
  });
  const { transactions = [] } = txData || {};
  const txLoading = txApiLoading || txApiFetching;
  // Fetch Assets
  const {
    data: assetData = [],
    error: assetApiError,
    isLoading: assetApiLoading,
    isFetching: assetApiFetching,
  } = useGetAssetsQuery(address!);
  const assetsLoading = assetApiLoading || assetApiFetching;
  // Get existing message fields/store functions
  const {
    txSendAddress,
    setTxSendAddress,
    setTxFromAddress,
    coin,
    setCoin,
    resetMessage,
  } = useMessage();
  // Update filtered txs list
  useEffect(() => {
    // Only run filter if we have transactions
    if (transactions.length) {
      const newFilteredTxs = transactions
        // First filter by txs which have recipientAddress
        .filter(({ recipientAddress }) => !!recipientAddress)
        // Pull out all of those txs into a new array
        .map(({ recipientAddress }) => recipientAddress as string)
        // Filter the array to only show each address once (uniques)
        .filter(
          (recipientAddress, index, ogListArray) =>
            ogListArray.indexOf(recipientAddress) === index
        )
        // Filter to remove "self" from address list
        .filter((recipientAddress) => recipientAddress !== address);
      // Save filtered list into state
      setFilteredTxs(newFilteredTxs);
    }
  }, [transactions, address]);
  // Update message fields
  useEffect(() => {
    setCoin(assetData[0]);
    setTxFromAddress(address);
  }, [assetData, setCoin, address, setTxFromAddress]);

  const renderRecentAddresses = () => {
    // Limit the amount of recent addresses rendered by the current limit
    const limitedTxList = filteredTxs.slice(0, recentAddressLimit);
    // Render recent addresses from created array
    return limitedTxList.map((address, index) => (
      <RecentAddressItem
        key={`${address}_${index}`}
        onClick={() => setTxSendAddress(address)}
      >
        <AddressInfo>
          <Address>{trimAddress(address!)}</Address>
        </AddressInfo>
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
      </RecentAddressItem>
    ));
  };

  const validateAndNavigate = () => {
    if (!txSendAddress) return setError('An address is required');
    if (!validateAddress(txSendAddress))
      return setError('Address entered is invalid');

    navigate(SEND_AMOUNT_URL);
  };

  const renderAssets = () =>
    assetsLoading ? ( // Are the assets loading
      <Loading />
    ) : !assetData.length ? ( // This account doesn't have any assets
      <>
        <Typo type="error" italic>
          {assetApiError
            ? `Failed to fetch account assets`
            : 'Account has no assets to send'}
        </Typo>
        <BottomFloat>
          <Button onClick={() => navigate(DASHBOARD_URL)}>Back</Button>
        </BottomFloat>
      </>
    ) : (
      // This account has assets, show them
      <>
        <SectionTitle>
          {assetData.length > 1 ? 'Select Asset' : 'Asset'}
        </SectionTitle>
        <AssetDropdown
          assets={assetData}
          activeDenom={coin?.denom}
          onChange={setCoin}
        />
      </>
    );

  const renderAddressInput = () => (
    <>
      <SectionTitle>Send to Address</SectionTitle>
      <Input
        placeholder="Enter or select address below"
        id="address"
        value={txSendAddress}
        onChange={setTxSendAddress}
        error={error}
        onKeyPress={(e) => keyPress(e, validateAndNavigate)}
      />
    </>
  );

  const renderRecentAddressesSection = () => (
    <>
      <SectionTitle>Recent Addresses</SectionTitle>
      <RecentAddressSection>
        {txLoading ? (
          <Loading />
        ) : !filteredTxs.length ? (
          txApiError ? (
            <Typo type="error" italic align="left">
              Error fetching recent addresses
            </Typo>
          ) : (
            <Typo type="body" align="left" italic>
              No recent addresses available
            </Typo>
          )
        ) : (
          <ScrollContainer height="169px" paddingBottom="0px">
            {renderRecentAddresses()}
            {recentAddressLimit < filteredTxs.length && (
              <RecentAddressItem>
                <AddressInfo
                  onClick={() => setRecentAddressLimit(recentAddressLimit + 3)}
                >
                  <Typo type="body" align="left" italic color="PRIMARY_500">
                    View More
                  </Typo>
                </AddressInfo>
              </RecentAddressItem>
            )}
          </ScrollContainer>
        )}
      </RecentAddressSection>
    </>
  );

  return (
    <Content>
      <Header
        title="Send"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={DASHBOARD_URL}
        backCallback={() => {
          resetMessage();
        }}
      />
      {renderAssets()}
      {!!assetData.length && (
        <>
          {renderAddressInput()}
          {renderRecentAddressesSection()}
          <BottomFloat>
            <Button onClick={validateAndNavigate}>Next</Button>
          </BottomFloat>
        </>
      )}
    </Content>
  );
};
