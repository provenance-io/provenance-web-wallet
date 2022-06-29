import { RequiresAuth } from 'Page';
import { APP_URL } from 'consts';
import { DASHBOARD } from './dashboard';
import { LANDING } from './landing';
import { ACTIONS } from './actions';
import { ASSET } from './asset';
import { TRANSACTIONS } from './transactions';
import { PROFILE } from './profile';
import { RESETWALLETS } from './resetWallets';
import { CONNECT } from './connect';
import { UNLOCK } from './unlock';
import { NOTIFICATION } from './notification';
import {
  NEW_ACCOUNT_CREATE,
  NEW_ACCOUNT_RECOVER,
  NEW_ACCOUNT_SUB,
  NEW_ACCOUNT_ADD,
  NEW_ACCOUNT_IMPORT,
} from './newAccount';

export const routes = [
  {
    path: APP_URL,
    element: (
      <RequiresAuth />
    ),
    children: [
      LANDING,
      DASHBOARD,
      ACTIONS,
      ASSET,
      TRANSACTIONS,
      PROFILE,
      RESETWALLETS,
      CONNECT,
    ],
  },
  NEW_ACCOUNT_ADD,
  NEW_ACCOUNT_CREATE,
  NEW_ACCOUNT_RECOVER,
  NEW_ACCOUNT_SUB,
  NEW_ACCOUNT_IMPORT,
  NOTIFICATION,
  UNLOCK,
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
