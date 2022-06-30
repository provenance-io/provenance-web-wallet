import { RENAME_ACCOUNT_URL } from 'consts';
import { Page, RenameAccount } from 'Page';

export const RENAME_ACCOUNT = {
  path: `${RENAME_ACCOUNT_URL}/:address`,
  element: <Page />,
  children: [
    { index: true, element: <RenameAccount /> },
  ],
};
