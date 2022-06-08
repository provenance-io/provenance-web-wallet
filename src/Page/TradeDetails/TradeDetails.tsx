import { useParams } from 'react-router-dom';
import { Header, List } from 'Components';
import styled from 'styled-components';
import { useAddress, useActiveAccount } from 'redux/hooks';
import { TRANSACTIONS_URL, ICON_NAMES } from 'consts';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  button {
    margin: 10px 0;
  }
`;
const Title = styled.div`
  font-weight: 700;
  font-family: 'Gothic A1';
  letter-spacing: 0.04em;
  line-height: 22px;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;

export const TradeDetails:React.FC = () => {

  // TODO: Update to search by transaction hash when endpoints are updated

  const { transactionHash } = useParams();
  const activeAccount = useActiveAccount();
  const { address } = activeAccount;
  const {
    allTransactions,
    getAddressTxAll,
    transactions,
    getAddressTx,
  } = useAddress();

  console.log(transactionHash);

  const message = transactions.find(item => item.hash === transactionHash) ||
                  allTransactions.find(item => item.hash === transactionHash) || 
                  {error: 'transaction details not found'};

  console.log(message);

  return (
    <Container>
      <Header iconLeft={ICON_NAMES.CLOSE} title="Trade Details" backLocation={TRANSACTIONS_URL} />
      {console.log(message)}
      <List message={message} />
    </Container>
  );
}