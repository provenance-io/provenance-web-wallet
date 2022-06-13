import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterNav, Select, AssetRow, Loading } from 'Components';
import styled from 'styled-components';
import { useAddress, useActiveAccount } from 'redux/hooks';
import { transactionOptions, imgOptions } from 'consts';
import { capitalize, trimString, hashFormat } from 'utils';

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

const NoTransactions = styled.div`
  text-align: left;
  font-size: 1.4rem;
`;

export const Transactions = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState('All Assets');
  const [selectedTxType, setSelectedTxType] = useState('All Transactions');
  const { 
    getAddressAssets, 
    getAddressTxAll, 
    assets, 
    allTransactions,
    assetsLoading,
    allTransactionsLoading,
  } = useAddress();
  const activeAccount = useActiveAccount();
  const { address } = activeAccount;

  // TODO: update useEffect once filters are in place on the endpoint

  // Grab data if needed
  useEffect(() => {
    if (address) {
      getAddressAssets(address);
      getAddressTxAll(address);
    };
  }, [getAddressTxAll, getAddressAssets, address]);

  // Set asset options
  const assetOptions = ['All Assets'].concat(assets.map(item => item.denom));

  const getImg = (img: string | undefined) => {
    // Convert to hash if needed
    if (img === 'nhash') {
      return 'hash';
    };
    // Check if svg exists
    if (img && imgOptions.includes(img)) {
      return img;
    }
    // Return Provenance Logo otherwise
    return 'provenance';
  };

  const getTransactionData = () => {
    const transactionData: typeof allTransactions = [];
    // All Assets and All Transactions
    if (selectedAsset === 'All Assets' && selectedTxType === 'All Transactions') {
      allTransactions.map(t => transactionData.push(t));
    };
    // All Assets and Specific Transactions
    if (selectedAsset === 'All Assets' && selectedTxType !== 'AllTransactions') {
      allTransactions.forEach(transaction => {
        if (transaction.status === selectedTxType.toLowerCase()) {
          transactionData.push(transaction);
        };
      })
    };
    // Specific Assets and All Transactions
    if (selectedAsset !== 'All Assets' && selectedTxType === 'All Transactions') {
      allTransactions.forEach(transaction => {
        if (transaction.denom === selectedAsset.toLowerCase()) {
          transactionData.push(transaction);
        };
      })
    };
    // Specific Assets and Specific Transactions
    if (selectedAsset !== 'All Assets' && selectedTxType !== 'All Transactions') {
      allTransactions.forEach(transaction => {
        if (transaction.denom === selectedAsset.toLowerCase() && transaction.status === selectedTxType.toLowerCase()) {
          transactionData.push(transaction);
        };
      })
    }
    return transactionData;
  };

  // TODO: Add a message if transactionData is empty. Will add once filters are provided
  return (
    <Container>
      <Title>Transactions</Title>
      <Select onChange={setSelectedAsset} options={assetOptions} value={selectedAsset} />
      <Select onChange={setSelectedTxType} options={transactionOptions} value={selectedTxType} />
      {assetsLoading || allTransactionsLoading ? <Loading /> :
        <AssetsContainer>
          {allTransactions.length === 0 ? 
            <NoTransactions>No transaction information available. Please try again or change accounts</NoTransactions>
            :
            getTransactionData().map(transaction => (
              <AssetRow 
                img={getImg(transaction.denom)}
                name={transaction.hash} 
                displayName={trimString(transaction?.denom === 'nhash' ? 'hash' : transaction.denom || capitalize(transaction.type), 21, 10)} 
                amount={{ count: `fee: ${(hashFormat('hash', transaction.feeAmount)).toFixed(2)} hash` }}
                onClick={() => navigate(`./${transaction.hash}`)}
              />
            ))}
        </AssetsContainer>
      }
      <FooterNav />
    </Container>
  );
};
