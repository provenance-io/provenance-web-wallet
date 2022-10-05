import { List, Header, Content } from 'Components';
import { hashFormat, txMessageFormat } from 'utils';
import type { TransactionHistory } from 'types';
import { useLocation } from 'react-router';

export const TransactionDetails: React.FC = () => {
  const location = useLocation() as { state: TransactionHistory };
  const transaction = location.state;

  const renderTxData = () => {
    // Clone targetTx to make changes if needed
    const finalTxData = { ...transaction };
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
  };

  return (
    <Content>
      <Header title="Transaction Details" marginBottom="20px" />
      {renderTxData()}
    </Content>
  );
};
