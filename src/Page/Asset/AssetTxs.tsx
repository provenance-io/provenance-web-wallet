import { RowItem, Typo, Loading } from 'Components';
import { TRANSACTIONS_URL, TRANSACTION_DETAILS_URL } from 'consts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useAddress } from 'redux/hooks';
import { capitalize } from 'utils';
import { format } from 'date-fns';

interface Props {
  assetName: string;
}

export const AssetTxs: React.FC<Props> = ({ assetName }) => {
  const count = 50; // How many to pull from API
  const page = 1; // What page to start pulling from
  const displayAmount = 3; // How many we want to show
  const { getAddressTx, transactions, transactionsError, transactionsLoading } =
    useAddress();
  const { address } = useActiveAccount();
  const navigate = useNavigate();

  // On load fetch all the recent txs
  useEffect(() => {
    getAddressTx({ address: address!, count, page });
  }, [getAddressTx, address]);

  // Filter to match the asset name with denom name
  const renderTxRows = () => {
    const txRows = transactions
      .filter(({ denom }) => {
        const isHash = denom === 'nhash' || denom === 'hash';
        const finalDenom = isHash ? 'hash' : denom;
        return finalDenom === assetName;
      })
      .slice(0, displayAmount)
      .map(({ type, time, denom, hash }) => {
        const date = time ? format(new Date(time), 'MMM dd, h:mm:ss a') : 'N/A';

        return (
          <RowItem
            key={hash}
            img={denom === 'nhash' ? 'hash' : 'provenance'}
            title={denom === 'nhash' ? 'hash' : capitalize(denom!, 'uppercase')}
            subtitle={`${capitalize(type)} • ${date}`}
            onClick={() => navigate(`${TRANSACTION_DETAILS_URL}/${hash}`)}
          />
        );
      });
    return txRows.length ? (
      txRows
    ) : (
      <Typo type="body" align="left" italic>
        No recent {assetName} transactions found
      </Typo>
    );
  };

  return (
    <>
      <Typo type="title" marginTop="30px" marginBottom="10px" align="left">
        Recent Transactions
      </Typo>
      {transactionsLoading ? (
        <Loading />
      ) : transactionsError ? (
        <Typo type="error">{transactionsError}</Typo>
      ) : (
        <>
          {renderTxRows()}
          <RowItem
            title="View All Transactions"
            onClick={() => navigate(TRANSACTIONS_URL)}
          />
        </>
      )}
    </>
  );
};
