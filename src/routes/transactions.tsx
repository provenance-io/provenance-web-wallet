import { TRANSACTIONS_URL } from 'consts';
import { Page, Transactions } from 'Page';

export const TRANSACTIONS = {
  path: TRANSACTIONS_URL,
  element: <Page />,
  children: [
    { index: true, element: <Transactions /> },
  ],
};
