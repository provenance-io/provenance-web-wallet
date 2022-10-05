import { RowItem, Typo, Loading } from 'Components';
import {
  TRANSACTIONS_URL,
  TRANSACTION_DETAILS_URL,
  ASSET_IMAGE_NAMES,
} from 'consts';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useAssetChart } from 'redux/hooks';
import { capitalize } from 'utils';
import { format } from 'date-fns';
import { useGetTransactionsQuery } from 'redux/services';

export const AssetTxs: React.FC = () => {
  const count = 10; // How many to pull from API
  const page = 1; // What page to start pulling from
  const displayAmount = 3; // How many we want to show
  const { address } = useActiveAccount();
  const { assetName } = useAssetChart();
  // Fetch Transactions
  const { data, isLoading, isFetching, error } = useGetTransactionsQuery({
    address: address!,
    count,
    page,
  });
  const { transactions = [] } = data || {};
  const loading = isLoading || isFetching;

  const navigate = useNavigate();

  const assetIconName =
    assetName && ASSET_IMAGE_NAMES.includes(assetName) ? assetName : 'provenance';

  // Filter to match the asset name with denom name
  const renderTxRows = () => {
    const txRows = transactions
      .filter(({ denom }) => {
        const isHash = denom === 'nhash' || denom === 'hash';
        const finalDenom = isHash ? 'hash' : denom;
        return finalDenom === assetName;
      })
      .slice(0, displayAmount)
      .map((transaction) => {
        const { type, time, denom, hash } = transaction;
        const date = time ? format(new Date(time), 'MMM dd, h:mm:ss a') : 'N/A';

        return (
          <RowItem
            key={hash}
            img={assetIconName}
            title={denom === 'nhash' ? 'HASH' : capitalize(denom!, 'uppercase')}
            subtitle={`${capitalize(type)} • ${date}`}
            onClick={() =>
              navigate(`${TRANSACTION_DETAILS_URL}/${hash}`, { state: transaction })
            }
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
      {loading ? (
        <Loading />
      ) : error ? (
        <Typo type="error" italic align="left">
          Failed to fetch recent transactions
        </Typo>
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
