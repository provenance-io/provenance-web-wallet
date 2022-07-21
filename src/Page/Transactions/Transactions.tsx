import { useEffect, useState } from 'react';
import { FooterNav, RowItem, Typo, Button, Loading, ButtonGroup } from 'Components';
import styled from 'styled-components';
import { useActiveAccount, useAddress } from 'redux/hooks';
import { ICON_NAMES, TRANSACTION_DETAILS_URL } from 'consts';
import { format } from 'date-fns';
import { capitalize } from 'utils';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  text-align: center;
  width: 100%;
  select {
    margin-top: 12px;
  }
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
  const maxPage = Math.ceil(transactionsTotalCount / count);
  
  // Fetch the current page of txs
  useEffect(() => {
    getAddressTx({ address: address!, count, page })
  }, [address, getAddressTx, page]);

  // Get the next page of transactions
  const changePage = (amount: number) => {
    setPage(page + amount);
  };

  const renderTxRows = () => transactions.map(({ type, time, denom, hash }, index) => {
    const date = time ? format(new Date(time), 'MMM dd, h:mm:ss a') : 'N/A'

    return (
      <RowItem
        key={index}
        img={denom === 'nhash' ? 'hash' : 'provenance'}
        title={denom === 'nhash' ? 'hash' : denom}
        subtitle={`${capitalize(type)} • ${date}`}
        onClick={() => navigate(`${TRANSACTION_DETAILS_URL}/${hash}`)}
      />
    )
  });

  const renderPagination = () => (
    <ButtonGroup direction="row" marginTop="20px">
      <Button
        icon={ICON_NAMES.ARROW}
        iconLocation="left"
        iconGap="6px"
        iconProps={{ spin: 0 }}
        onClick={() => changePage(-1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <Button
        icon={ICON_NAMES.ARROW}
        iconLocation="right"
        iconGap="6px"
        iconProps={{ spin: 180 }}
        onClick={() => changePage(1)}
        disabled={page >= maxPage}
      >
        Next
      </Button>
    </ButtonGroup>
  );

  return (
    <Container>
      <Typo type='title'>Transaction History</Typo>
      <Typo type="displayBody">Page {page} / {maxPage}</Typo>
      <AssetsContainer>
        {transactionsError ?
          <Typo type="error">{transactionsError}</Typo> :
          transactionsLoading ? <Loading /> :
          <>
            {renderTxRows()}
            {renderPagination()}
          </>
        }
      </AssetsContainer>
      <FooterNav />
    </Container>
  );
};
