import { useState } from 'react';
import { FooterNav, Select, Asset } from 'Components';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  width: 100%;
  select {
    margin-top: 12px;
  }
`;
const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  font-family: 'Gothic A1', sans-serif;
  margin-bottom: 4px;
`;
const AssetsContainer = styled.div`
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  text-align: left;
  padding-bottom: 80px;
  margin-top: 50px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Transactions = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedTxType, setSelectedTxType] = useState('');
  // Temp options value, this needs to come from wallets current assets
  const assetOptions = ['All Assets', 'HASH', 'USDF', 'ETF', 'INU'];
  const transactionOptions = ['All Transactions', 'Success', 'Pending', 'Failed'];

  return (
    <Container>
      <Title>Transaction Details</Title>
      <Select onChange={setSelectedAsset} options={assetOptions} value={selectedAsset} />
      <Select onChange={setSelectedTxType} options={transactionOptions} value={selectedTxType} />
      <AssetsContainer>
        <Asset img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
        <Asset img="usdf" name="usdf" />
        <Asset img="etf" name="etf" />
        <Asset img="inu" name="inu" />
      </AssetsContainer>
      <FooterNav />
    </Container>
  );
};
