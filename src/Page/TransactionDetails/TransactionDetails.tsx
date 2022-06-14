import { useParams } from 'react-router-dom';
import { Header, List, CopyValue } from 'Components';
import styled from 'styled-components';
import { useAddress } from 'redux/hooks';
import { TRANSACTIONS_URL, ICON_NAMES } from 'consts';
import { trimString, hashFormat, capitalize } from 'utils';

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

type MessageProps = { [key: string]: string | number | undefined };

export const TransactionDetails:React.FC = () => {

  // TODO: Update to search by transaction hash when endpoints are updated

  const { transactionHash } = useParams();
  const {
    allTransactions,
    //getAddressTxAll,
    transactions,
    //getAddressTx,
  } = useAddress();

  // Find transactions searching through address, then explorer
  const allMessages = transactions.find(item => item.hash === transactionHash) ||
                      allTransactions.find(item => item.hash === transactionHash) || 
                      {error: 'transaction details not found'};

  // Format messages for List component
  const formatMessages = () => {
    const message: { [key: string]: string | number | JSX.Element | undefined } = {};
    Object.keys(allMessages).forEach(item => {
      switch (item) {
        case 'hash':
        case 'signer': {
          message[item] = (
            <CopyValue value={String((allMessages as MessageProps)[item])}>
              {trimString(String((allMessages as MessageProps)[item]), 14, 7)}
            </CopyValue>
          );
          break;
        }
        case 'feeAmount':
          message[item] = `${hashFormat('hash', (allMessages as MessageProps)[item] as string)} hash`;
          break;
        case 'status':
        case 'type':
          message[item] = capitalize(String((allMessages as MessageProps)[item]));
          break;
        default:
          message[item] = (allMessages as MessageProps)[item];
          break;
      };
    });
    return message;
  };

  return (
    <Container>
      <Header iconLeft={ICON_NAMES.CLOSE} title="Transaction Details" backLocation={TRANSACTIONS_URL} />
      <List message={formatMessages()} />
    </Container>
  );
}