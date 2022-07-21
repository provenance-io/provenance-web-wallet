import { FooterNav, RowItem, Typo, Button, Loading, ButtonGroup, List, Header } from 'Components';
import styled from 'styled-components';
import { useAddress } from 'redux/hooks';
import { ICON_NAMES } from 'consts';
import { format } from 'date-fns';
import { capitalize } from 'utils';
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
    return targetTx ? <List message={targetTx} /> : <Typo type="error">Unable to find transaction details</Typo>
  }

  return (
    <Container>
      <Header title="Transaction Details" marginBottom='20px' />
      {renderTxData()}
    </Container>
  );
};
