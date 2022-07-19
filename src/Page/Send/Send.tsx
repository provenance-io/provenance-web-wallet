import { useState, useEffect } from 'react';
import { Header, AssetDropdown, Input, Sprite, Button, Content, BottomFloat, Loading, Typo } from 'Components';
import styled from 'styled-components';
import { DASHBOARD_URL, ICON_NAMES, SEND_AMOUNT_URL } from 'consts';
import { trimString, validateAddress } from 'utils';
import { useNavigate } from 'react-router';
import { useActiveAccount, useAddress, useMessage } from 'redux/hooks';
import { format, parseISO } from 'date-fns';

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
  border-top: 1px solid #3D4151;
  cursor: pointer;
  transition: 250ms all;
  &:hover {
    background: #2C3040;
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
const Date = styled.div`
  font-size: 1.2rem;
  color: #B9BDCA;
`;

export const Send: React.FC = () => {
  const navigate = useNavigate();
  const {
    assets,
    transactions,
    getAddressTx,
    transactionsLoading,
    transactionsError,
  } = useAddress();
  const recentAddresses = [...transactions].splice(0, 4);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    txSendAddress,
    setTxSendAddress,
    setTxFromAddress,
    coin,
    setCoin,
    resetMessage,
  } = useMessage();
  const { address } = useActiveAccount();

  // Initial load fetch all transactions
  useEffect(() => {
    if (initialLoad && address) {
      setInitialLoad(false);
      setTxFromAddress(address);
      getAddressTx(address);
    }
  }, [initialLoad, address, getAddressTx, setTxFromAddress]);

  useEffect(() => {
    setCoin(assets[0]);
  }, [assets, setCoin]);

  const renderRecentAddresses = () =>
    recentAddresses.map(({ recipientAddress, timestamp }, index) => (
      <RecentAddressItem
        key={`${recipientAddress}_${index}`}
        onClick={() => setTxSendAddress(recipientAddress)}
      >
        <AddressInfo>
          <Address>{trimString(recipientAddress, 11, 4)}</Address>
          <Date>{format(parseISO(timestamp), 'M/d/yy')}</Date>
        </AddressInfo>
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
      </RecentAddressItem>
    ));

  const validateAndNavigate = () => {
    if (!txSendAddress) return setError('An address is required');
    if (!validateAddress(txSendAddress)) return setError('Address entered is invalid');

    navigate(SEND_AMOUNT_URL);
  };

  return (
    <Content>
      <Header title="Send" iconLeft={ICON_NAMES.CLOSE} backLocation={DASHBOARD_URL} backCallback={() => { resetMessage() }} />
      {assets.length ? (
        <>
          <SectionTitle>{assets.length > 1 ? 'Select Asset' : 'Asset'}</SectionTitle>
          <AssetDropdown assets={assets} activeDenom={coin?.denom} onChange={setCoin} />
          <SectionTitle>Send to Address</SectionTitle>
          <Input
            placeholder="Enter or select address below"
            id="address"
            value={txSendAddress}
            onChange={setTxSendAddress}
            error={error}
          />
          <SectionTitle>Recent Addresses</SectionTitle>
          <RecentAddressSection>
            {!!transactionsError && <Typo type="error">Error fetching recent addresses: {transactionsError}</Typo>}
            {transactionsLoading ?
              <Loading /> :
              !transactions.length ?
              <Typo type="body" align='left' textStyle='italic'>No recent addresses available</Typo> :
              renderRecentAddresses()
            }
            {!!transactions.length &&
              <RecentAddressItem>
                <AddressInfo>View All</AddressInfo>
                <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
              </RecentAddressItem>
            }
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
  )
};
