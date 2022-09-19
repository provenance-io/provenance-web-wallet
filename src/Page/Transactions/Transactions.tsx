import { useEffect, useState } from 'react';
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
import { useActiveAccount, useAddress } from 'redux/hooks';
import { ICON_NAMES, TRANSACTION_DETAILS_URL } from 'consts';
import { format } from 'date-fns';
import { capitalize } from 'utils';
import { useNavigate } from 'react-router-dom';

export const Transactions = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { address } = useActiveAccount();
  const {
    getAddressTx,
    transactions,
    transactionsTotalCount,
    transactionsLoading,
    transactionsError,
  } = useAddress();
  // Return 10 txs at a time each page
  const count = 6;
  // Will always need to be 1 page at least (prevent "1/0" on load)
  const maxPage = Math.ceil(transactionsTotalCount / count) || 1;

  // Fetch the current page of txs
  useEffect(() => {
    getAddressTx({ address: address!, count, page });
  }, [address, getAddressTx, page]);

  // Get the next page of transactions
  const changePage = (amount: number) => {
    setPage(page + amount);
  };

  const renderTxRows = () =>
    transactions.map(({ type, time, denom, hash }) => {
      const date = time ? format(new Date(time), 'MMM dd, h:mm:ss a') : 'N/A';

      return (
        <RowItem
          key={hash}
          img={denom === 'nhash' ? 'hash' : 'provenance'}
          title={denom === 'nhash' ? 'HASH' : capitalize(denom!, 'uppercase')}
          subtitle={`${capitalize(type)} • ${date}`}
          onClick={() => navigate(`${TRANSACTION_DETAILS_URL}/${hash}`)}
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

  return (
    <Content>
      <Typo type="headline2">Transactions</Typo>
      <Typo type="bodyAlt" marginBottom="20px">
        {transactionsLoading ? `Loading Page ${page}` : `Page ${page} / ${maxPage}`}
      </Typo>
      <ScrollContainer height="386px" paddingBottom="10px">
        {transactionsError ? (
          <Typo type="error">{transactionsError}</Typo>
        ) : transactionsLoading ? (
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
