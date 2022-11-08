import { RequiresAuth } from 'Page';
import { APP_URL } from 'consts';
import {
  DASHBOARD,
  DASHBOARD_MENU,
  DASHBOARD_RECEIVE,
  DASHBOARD_CONNECTION_DETAILS,
} from './dashboard';
import { LANDING } from './landing';
import { ACTIONS } from './actions';
import { ASSET } from './asset';
import { TRANSACTIONS } from './transactions';
import { SETTINGS } from './settings';
import { RESET_WALLET } from './resetWallet';
import { UNLOCK } from './unlock';
import { NOTIFICATION } from './notification';
import {
  // NEW_ACCOUNT_CREATE,
  NEW_ACCOUNT_RECOVER,
  NEW_ACCOUNT_SUB,
  // NEW_ACCOUNT_ADD,
  NEW_ACCOUNT_IMPORT,
} from './newAccount';
import { NEW_ACCOUNT_CREATE_TAB, NEW_ACCOUNT_ADD_TAB } from './newAccountTab';
import { REMOVE_ACCOUNT } from './removeAccount';
import { RENAME_ACCOUNT } from './renameAccount';
import { SEND } from './send';
import { TRANSACTION_DETAILS } from './transactionDetails';

export const routes = [
  {
    path: APP_URL,
    element: <RequiresAuth />,
    children: [
      LANDING,
      DASHBOARD,
      DASHBOARD_MENU,
      DASHBOARD_RECEIVE,
      DASHBOARD_CONNECTION_DETAILS,
      ACTIONS,
      ASSET,
      TRANSACTIONS,
      TRANSACTION_DETAILS,
      SETTINGS,
      SEND,
    ],
  },
  // NEW_ACCOUNT_ADD,
  // NEW_ACCOUNT_CREATE,
  NEW_ACCOUNT_RECOVER,
  NEW_ACCOUNT_SUB,
  NEW_ACCOUNT_IMPORT,
  NEW_ACCOUNT_CREATE_TAB,
  NEW_ACCOUNT_ADD_TAB,
  NOTIFICATION,
  REMOVE_ACCOUNT,
  RENAME_ACCOUNT,
  RESET_WALLET,
  UNLOCK,
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
