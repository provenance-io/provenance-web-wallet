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
  &:last-of-type {
    margin-bottom: 60px;
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
  const [totalUniqueAddresses, setTotalUniqueAddresses] = useState(0);
  const [recentTxAddresses, setRecentTxAddresses] = useState<string[]>([]);
  const [txHaveBeenFetched, setTxHaveBeenFetched] = useState(false);
  const [txsHaveBeenFiltered, setTxsHaveBeenFiltered] = useState(false);
  const navigate = useNavigate();
  const { address } = useActiveAccount();
  // Fetch Transactions
  const {
    data: txData,
    error: txApiError,
    isLoading: txApiLoading,
    isFetching: txApiFetching,
  } = useGetTransactionsQuery({
    // address: address!,
    address: address!,
    count: recentAddressLimit,
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

  // Update message fields
  useEffect(() => {
    setCoin(assetData[0]);
    setTxFromAddress(address);
  }, [assetData, setCoin, address, setTxFromAddress]);

  // Build array of recent addresses (Only do this once)
  useEffect(() => {
    // Only run after txs have been pulled (initialLoad)
    if (txHaveBeenFetched && !txsHaveBeenFiltered) {
      setTxsHaveBeenFiltered(true);
      // Pull txs with recipient, create array from just those addresses
      const txsRecipientList = transactions
        .filter(({ recipientAddress }) => !!recipientAddress)
        .map(({ recipientAddress }) => recipientAddress);
      // Remove duplicate addresses
      const txsDupsFiltered = [...new Set(txsRecipientList)];
      setTotalUniqueAddresses(txsDupsFiltered.length);
      setRecentTxAddresses(txsDupsFiltered as string[]);
    }
    // When this component unmounts, just set fetched and filtered to true
    return () => {
      setTxHaveBeenFetched(true);
      setTxsHaveBeenFiltered(true);
    };
  }, [transactions, txsHaveBeenFiltered, txHaveBeenFetched]);

  const renderRecentAddresses = () => {
    // Limit the amount of recent addresses rendered by the current limit
    const limitedTxList = [...recentTxAddresses].splice(0, recentAddressLimit);
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
      {assetData.length ? (
        <>
          <SectionTitle>
            {assetData.length > 1 ? 'Select Asset' : 'Asset'}
          </SectionTitle>
          <AssetDropdown
            assets={assetData}
            activeDenom={coin?.denom}
            onChange={setCoin}
          />
          <SectionTitle>Send to Address</SectionTitle>
          <Input
            placeholder="Enter or select address below"
            id="address"
            value={txSendAddress}
            onChange={setTxSendAddress}
            error={error}
            onKeyPress={(e) => keyPress(e, validateAndNavigate)}
          />
          <SectionTitle>Recent Addresses</SectionTitle>
          <RecentAddressSection>
            {!!txApiError && (
              <Typo type="error">Error fetching recent addresses: {txApiError}</Typo>
            )}
            {txLoading ? (
              <Loading />
            ) : !transactions.length ? (
              <Typo type="body" align="left" textStyle="italic">
                No recent addresses available
              </Typo>
            ) : (
              renderRecentAddresses()
            )}
            {!!transactions.length && recentAddressLimit < totalUniqueAddresses && (
              <RecentAddressItem>
                <AddressInfo
                  onClick={() => setRecentAddressLimit(recentAddressLimit + 3)}
                >
                  View More
                </AddressInfo>
              </RecentAddressItem>
            )}
          </RecentAddressSection>
          <BottomFloat>
            <Button onClick={validateAndNavigate}>Next</Button>
          </BottomFloat>
        </>
      ) : (
        <>
          <SectionTitle>Account has no assets to send</SectionTitle>
          <BottomFloat>
            <Button onClick={() => navigate(DASHBOARD_URL)}>Back</Button>
          </BottomFloat>
        </>
      )}
    </Content>
  );
};
