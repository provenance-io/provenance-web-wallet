import { RESET_WALLET_URL } from 'consts';
import { Page, ResetWallet } from 'Page';

export const RESET_WALLET = {
  path: RESET_WALLET_URL,
  element: <Page />,
  children: [
    { index: true, element: <ResetWallet /> },
  ],
};
