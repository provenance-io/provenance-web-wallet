import { RESET_WALLETS_URL } from 'consts';
import { Page, ResetWallets } from 'Page';

export const RESETWALLETS = {
  path: RESET_WALLETS_URL,
  element: <Page />,
  children: [
    { index: true, element: <ResetWallets /> },
  ],
};
