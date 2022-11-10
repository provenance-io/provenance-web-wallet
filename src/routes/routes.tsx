import { ACTIONS } from './actions';
import { APP_URL } from 'consts';
import { ASSET } from './asset';
import {
  DASHBOARD,
  DASHBOARD_MENU,
  DASHBOARD_RECEIVE,
  DASHBOARD_CONNECTION_DETAILS,
} from './dashboard';
import { LANDING } from './landing';
import { NEW_ACCOUNT_ADD } from './newAccountAdd';
import { NEW_ACCOUNT_CREATE } from './newAccountCreate';
import { NEW_ACCOUNT_IMPORT } from './newAccountImport';
import { NEW_ACCOUNT_RECOVER } from './newAccountRecover';
import { NEW_ACCOUNT_SUB } from './newAccountSub';
import { NOTIFICATION } from './notification';
import { REMOVE_ACCOUNT } from './removeAccount';
import { RENAME_ACCOUNT } from './renameAccount';
import { RequiresAuth } from 'Page';
import { RESET_WALLET } from './resetWallet';
import { SEND } from './send';
import { SETTINGS } from './settings';
import { TRANSACTION_DETAILS } from './transactionDetails';
import { TRANSACTIONS } from './transactions';
import { UNLOCK } from './unlock';

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
  NEW_ACCOUNT_RECOVER,
  NEW_ACCOUNT_SUB,
  NEW_ACCOUNT_IMPORT,
  NEW_ACCOUNT_CREATE,
  NEW_ACCOUNT_ADD,
  NOTIFICATION,
  REMOVE_ACCOUNT,
  RENAME_ACCOUNT,
  RESET_WALLET,
  UNLOCK,
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
