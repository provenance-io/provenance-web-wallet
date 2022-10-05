import { useState } from 'react';
import {
  FooterNav,
  RowItem,
  Typo,
  Button,
  Loading,
  ButtonGroup,
  ScrollContainer,
  BottomFloat,
  Content,
} from 'Components';
import { useActiveAccount } from 'redux/hooks';
import { ICON_NAMES, TRANSACTION_DETAILS_URL } from 'consts';
import { format } from 'date-fns';
import { capitalize } from 'utils';
import { useNavigate } from 'react-router-dom';
import { useGetTransactionsQuery } from 'redux/services';

export const Transactions = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { address } = useActiveAccount();
  // Return 10 txs at a time each page
  const count = 6;

  const { data, error, isLoading, isFetching } = useGetTransactionsQuery({
    address: address as string,
    page,
    count,
  });
  const { transactions = [], pages: maxPage = 1 } = data || {};

  // Get the next page of transactions
  const changePage = (amount: number) => {
    setPage(page + amount);
  };

  const renderTxRows = () =>
    transactions.map((transaction) => {
      const { type, time, denom, hash } = transaction;
      const date = time ? format(new Date(time), 'MMM dd, h:mm:ss a') : 'N/A';

      return (
        <RowItem
          key={hash}
          img={denom === 'nhash' ? 'hash' : 'provenance'}
          title={denom === 'nhash' ? 'HASH' : capitalize(denom!, 'uppercase')}
          subtitle={`${capitalize(type)} • ${date}`}
          onClick={() =>
            navigate(`${TRANSACTION_DETAILS_URL}/${hash}`, { state: transaction })
          }
        />
      );
    });

  const renderPageButtons = () => (
    <BottomFloat bottom="66px;">
      <ButtonGroup direction="row" childWidth="50%">
        <Button
          icon={ICON_NAMES.ARROW}
          iconLocation="left"
          iconGap="6px"
          iconSize="12px"
          iconProps={{ spin: 0 }}
          onClick={() => changePage(-1)}
          disabled={page <= 1}
          size="medium"
        >
          Previous
        </Button>
        <Button
          icon={ICON_NAMES.ARROW}
          iconLocation="right"
          iconGap="6px"
          iconSize="12px"
          iconProps={{ spin: 180 }}
          onClick={() => changePage(1)}
          disabled={page >= maxPage}
          size="medium"
        >
          Next
        </Button>
      </ButtonGroup>
    </BottomFloat>
  );

  const loading = isLoading || isFetching;

  return (
    <Content>
      <Typo type="headline2">Transactions</Typo>
      <Typo type="bodyAlt" marginBottom="20px">
        {loading ? `Loading Page ${page}` : `Page ${page} / ${maxPage}`}
      </Typo>
      <ScrollContainer height="386px" paddingBottom="10px">
        {error ? (
          <Typo type="error" italic>
            Failed to fetch transactions
          </Typo>
        ) : loading ? (
          <Loading />
        ) : (
          <>
            {renderTxRows()}
            {renderPageButtons()}
          </>
        )}
      </ScrollContainer>
      <FooterNav />
    </Content>
  );
};
