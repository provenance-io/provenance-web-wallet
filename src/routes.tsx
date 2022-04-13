// import { Navigate } from 'react-router-dom';
import {
  ConnectionDetails,
  ConnectionSuccess,
  CreateComplete,
  CreateStart,
  Dashboard,
  DashboardMenu,
  DashboardReceive,
  DashboardSend,
  EnterSeed,
  Landing,
  Page,
  Passphrase,
  PassphraseIntro,
  RecoverNote,
  RecoverAccountName,
  RequiresAuth,
  VerifyPassphrase,
  Transactions,
  Profile,
  ResetWallets,
  Confirm,
  TradeDetails,
  TransactionComplete,
} from 'Page';

export const APP_URL = '/';
// DASHBOARD
export const DASHBOARD_URL = '/dashboard';
export const DASHBOARD_MENU_URL = '/dashboard/menu';
export const DASHBOARD_SEND_URL = '/dashboard/send';
export const DASHBOARD_RECEIVE_URL = '/dashboard/receive';
// PROFILE
export const PROFILE_URL = '/profile';
export const RESET_WALLETS_URL = '/profile/reset-wallets';
// TRANSACTIONS
export const TRANSACTIONS_URL = '/transactions';
export const TRADE_DETAILS_URL = '/trade-details';
export const TRANSACTION_COMPLETE_URL = '/transaction-complete';
// RECOVER URLS
export const RECOVER_URL = '/recover';
export const RECOVER_NOTE_URL = '/recover/note';
export const RECOVER_SEED_URL = '/recover/seed';
// CONFIRMATION
export const CONFIRM_URL = '/confirm';
export const CONNECT_REQUEST_URL = '/connect';
// CONNECTION
export const CONNECT_SUCCESS_URL = '/connect-success';
export const CONNECT_DETAILS_URL = '/connect-details';
// CREATE URLS
export const CREATE_URL = '/create';
export const CREATE_PASSPHRASE_INTRO_URL = '/create/passphrase-intro';
export const CREATE_PASSPHRASE_URL = '/create/passphrase';
export const CREATE_VERIFY_PASSPHRASE_URL = '/create/verify-passphrase';
export const CREATE_COMPLETE_URL = '/create/complete';

export const routes = [
  {
    path: APP_URL,
    element: (
      <RequiresAuth />
    ),
    children: [
      // LANDING PAGE
      { index: true, element: <Page bgImage align="center" justify='flex-end'><Landing /></Page> },
      // DASHBOARD
      {
        path: DASHBOARD_URL,
        element: <Page />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: DASHBOARD_MENU_URL, element: <DashboardMenu /> },
          { path: DASHBOARD_SEND_URL, element: <DashboardSend /> },
          { path: DASHBOARD_RECEIVE_URL, element: <DashboardReceive /> },
        ]
      },
      // TRANSACTIONS
      {
        path: TRANSACTIONS_URL,
        element: <Page />,
        children: [
          { index: true, element: <Transactions /> },
        ],
      },
      {
        path: TRADE_DETAILS_URL,
        element: <Page />,
        children: [
          { index: true, element: <TradeDetails /> },
        ],
      },
      {
        path: TRANSACTION_COMPLETE_URL,
        element: <Page bgImage/>,
        children: [
          { index: true, element: <TransactionComplete /> },
        ],
      },
      // PROFILE
      {
        path: PROFILE_URL,
        element: <Page />,
        children: [
          { index: true, element: <Profile /> },
        ],
      },
      // RESET WALLETS
      {
        path: RESET_WALLETS_URL,
        element: <Page />,
        children: [
          { index: true, element: <ResetWallets /> },
        ],
      },
      // CONFIRMATION
      {
        path: CONFIRM_URL,
        element: <Page />,
        children: [
          { index: true, element: <Confirm /> },
        ],
      },
      {
        path: CONNECT_REQUEST_URL,
        element: <Page bgImage/>,
        children: [
          { index: true, element: <Confirm /> },
        ],
      },
      // CONNECTION
      {
        path: CONNECT_SUCCESS_URL,
        element: <Page bgImage/>,
        children: [
          { index: true, element: <ConnectionSuccess /> },
        ],
      },
      {
        path: CONNECT_DETAILS_URL,
        element: <Page />,
        children: [
          { index: true, element: <ConnectionDetails /> },
        ],
      },
      // RECOVER
      {
        path: RECOVER_URL,
        element: <Page align='center'/>,
        children: [
          { index: true, element: <RecoverAccountName /> },
          {
            path: RECOVER_SEED_URL,
            element: <EnterSeed />,
          },
          {
            path: RECOVER_NOTE_URL,
            element: <RecoverNote />,
          },
        ]
      },
    ],
  },
  {
    path: CREATE_URL,
    element: <Page />,
    children: [
      { index: true, element: <CreateStart nextUrl={CREATE_PASSPHRASE_INTRO_URL} /> },
      {
        path: CREATE_PASSPHRASE_INTRO_URL,
        element: <PassphraseIntro nextUrl={CREATE_PASSPHRASE_URL} />,
      },
      {
        path: CREATE_PASSPHRASE_URL,
        element: <Passphrase nextUrl={CREATE_VERIFY_PASSPHRASE_URL} />,
      },
      {
        path: CREATE_VERIFY_PASSPHRASE_URL,
        element: <VerifyPassphrase nextUrl={CREATE_COMPLETE_URL} />,
      },
      { path: CREATE_COMPLETE_URL, element: <CreateComplete nextUrl={APP_URL} /> },
    ],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
