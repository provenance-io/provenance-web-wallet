import { useState } from 'react';
import { Header, AssetDropdown, Input, Sprite, Button } from 'Components';
import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { trimString } from 'utils';

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

export const DashboardSend:React.FC = () => {
  // TODO: Pull actual assets
  const assets = [
    { id: 0, icon: 'hash', name: 'HASH', value: 523.25, amount: 302.02, },
    { id: 1, icon: 'etf', name: 'ETF', value: 420.01, amount: 10.3, },
    { id: 2, icon: 'inu', name: 'INU', value: 10.10, amount: 1000.20, },
    { id: 3, icon: 'usdf', name: 'USDF', value: 3.50, amount: 454.44, },
  ];
  // TODO: Pull actual recent addresses (address/date)
  const recentAddresses = [
    ['tp1pyl73k8ajx33x37m7p2rz3378eqq6tacuvhm57', '11/08/21'],
    ['tp19fn5mlntyxafugetc8lyzzre6nnyqsq95449gt', '10/04/21'],
    ['tp18cudfyyw855cvnrgvnv9fq69da459tskphy6ew', '9/01/21'],
    ['tp1gda5wdauu0ea68yrtdnv827n8tauvtucwyj33c', '6/18/21'],
    ['tp129f5qpa8exnpqhzzp8r7ccjkmuqvypm84g9cq3', '2/22/21'],
  ];
  const [sendAddress, setSendAddress] = useState('');
  const [activeAssetID, setActiveAssetID] = useState(assets[0].id);
  
  const renderRecentAddresses = () => recentAddresses.map(([address, date], index) => (
    <RecentAddressItem key={`${address}_${index}`} onClick={() => setSendAddress(address)}>
      <AddressInfo>
        <Address>{trimString(address, 11, 4)}</Address>
        <Date>{date}</Date>
      </AddressInfo>
      <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
    </RecentAddressItem>
  ));

  return (
    <Wrapper>
      <Header title="Send" iconLeft={ICON_NAMES.CLOSE} />
      <SectionTitle>Select Asset</SectionTitle>
      <AssetDropdown assets={assets} activeID={activeAssetID} onChange={setActiveAssetID} />
      <SectionTitle>Send to Address</SectionTitle>
      <Input placeholder='Enter or select address below' id="address" value={sendAddress} onChange={setSendAddress} />
      <SectionTitle>Recent Addresses</SectionTitle>
      <RecentAddressSection>
        {renderRecentAddresses()}
        <RecentAddressItem>
          <AddressInfo>
            View All
          </AddressInfo>
          <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
        </RecentAddressItem>
      </RecentAddressSection>
      <Button variant='primary'>Next</Button>
    </Wrapper>
  )
};
