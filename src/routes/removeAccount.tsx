import { REMOVE_ACCOUNT_URL } from 'consts';
import { Page, RemoveAccount } from 'Page';

export const REMOVE_ACCOUNT = {
  path: `${REMOVE_ACCOUNT_URL}/:address`,
  element: <Page />,
  children: [
    { index: true, element: <RemoveAccount /> },
  ],
};
