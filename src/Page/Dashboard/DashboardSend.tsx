import { useEffect, useState } from 'react';
import { Header, AssetDropdown, Input, Sprite, Button } from 'Components';
import styled from 'styled-components';
import { ICON_NAMES, SEND_URL } from 'consts';
import { trimString } from 'utils';
import { useNavigate } from 'react-router';
import { useAddress, useMessage } from 'redux/hooks';
import { format, parseISO } from 'date-fns';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
`;
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
  border-top: 1px solid #3d4151;
  cursor: pointer;
  transition: 250ms all;
  &:hover {
    background: #2c3040;
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
  color: #b9bdca;
`;

export const DashboardSend: React.FC = () => {
  const navigate = useNavigate();
  const { assets, transactions } = useAddress();
  const recentAddresses = [...transactions].splice(0, 4);
  const [error, setError] = useState('');
  const { coinAddress, setCoinAddress, coin, setCoin } = useMessage();

  useEffect(() => {
    setCoin(assets[0]);
  }, [assets, setCoin]);

  const renderRecentAddresses = () =>
    recentAddresses.map(({ recipientAddress, timestamp }, index) => (
      <RecentAddressItem
        key={`${recipientAddress}_${index}`}
        onClick={() => setCoinAddress(recipientAddress)}
      >
        <AddressInfo>
          <Address>{trimString(recipientAddress, 11, 4)}</Address>
          <Date>{format(parseISO(timestamp), 'M/d/yy')}</Date>
        </AddressInfo>
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
      </RecentAddressItem>
    ));

  const validateAndNavigate = () => {
    if (!coinAddress) {
      return setError('An address is required');
    }

    navigate(SEND_URL);
  };

  return (
    <Wrapper>
      <Header title="Send" iconLeft={ICON_NAMES.CLOSE} />
      <SectionTitle>Select Asset</SectionTitle>
      {!!assets.length && <AssetDropdown assets={assets} activeDenom={coin?.denom} onChange={setCoin} />}
      <SectionTitle>Send to Address</SectionTitle>
      <Input
        placeholder="Enter or select address below"
        id="address"
        value={coinAddress}
        onChange={setCoinAddress}
        error={error}
      />
      <SectionTitle>Recent Addresses</SectionTitle>
      <RecentAddressSection>
        {renderRecentAddresses()}
        <RecentAddressItem>
          <AddressInfo>View All</AddressInfo>
          <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
        </RecentAddressItem>
      </RecentAddressSection>
      <Button onClick={validateAndNavigate}>Next</Button>
    </Wrapper>
  );
};