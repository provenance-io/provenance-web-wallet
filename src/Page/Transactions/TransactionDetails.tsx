import { Typo, List, Header } from 'Components';
import styled from 'styled-components';
import { useAddress } from 'redux/hooks';
import { hashFormat, txMessageFormat } from 'utils';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  text-align: center;
  width: 100%;
  select {
    margin-top: 12px;
  }
`;

export const TransactionDetails = () => {
  const { transactions } = useAddress();
  const { hash: targetHash } = useParams();

  const renderTxData = () => {
    const targetTx = transactions.find(({ hash }) => hash === targetHash);
    if (targetTx) {
      // Clone targetTx to make changes if needed
      const finalTxData = { ...targetTx };
      // If we have both amount and denom, combine into object and remove individual
      if (finalTxData.amount && finalTxData.denom) {
        const { amount, denom } = finalTxData;
        const isHash = finalTxData.denom === 'nhash';
        finalTxData.amount = {
          amount: isHash ? hashFormat(amount as string) : (amount as string),
          denom: isHash ? 'Hash' : denom,
        };
        delete finalTxData.denom;
      }
      const formattedTx = txMessageFormat(finalTxData);
      return <List message={formattedTx} />;
    }
    return <Typo type="error">Unable to find transaction details</Typo>;
  };

  return (
    <Container>
      <Header title="Transaction Details" marginBottom="20px" />
      {renderTxData()}
    </Container>
  );
};
