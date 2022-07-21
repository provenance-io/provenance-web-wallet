import { TRANSACTION_DETAILS_URL } from 'consts';
import { Page, TransactionDetails } from 'Page';

export const TRANSACTION_DETAILS = {
  path: `${TRANSACTION_DETAILS_URL}`,
  element: <Page />,
  children: [
    { index: true, element: <TransactionDetails /> },
  ],
};
