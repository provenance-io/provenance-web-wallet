import {
  ConnectionDetails,
  ConnectionSuccess,
  CreateComplete,
  CreateFlow,
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
  Asset,
  ResetWallets,
  Confirm,
  TradeDetails,
  TransactionComplete,
} from 'Page';
import {
  APP_URL,
  DASHBOARD_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_SEND_URL,
  DASHBOARD_RECEIVE_URL,
  ASSET_URL,
  TRANSACTIONS_URL,
  TRADE_DETAILS_URL,
  TRANSACTION_COMPLETE_URL,
  PROFILE_URL,
  RESET_WALLETS_URL,
  CONFIRM_URL,
  CONNECT_REQUEST_URL,
  CONNECT_SUCCESS_URL,
  CONNECT_DETAILS_URL,
  RECOVER_URL,
  RECOVER_SEED_URL,
  RECOVER_NOTE_URL,
  CREATE_URL,
  CREATE_PASSPHRASE_INTRO_URL,
  CREATE_PASSPHRASE_URL,
  CREATE_VERIFY_PASSPHRASE_URL,
  CREATE_COMPLETE_URL,
} from 'consts';

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
      // ASSET
      {
        path: ASSET_URL,
        element: <Page bgImage />,
        children: [
          { index: true, element: <Asset /> },
        ],
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
    element: <CreateFlow />,
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
      { path: CREATE_COMPLETE_URL, element: <CreateComplete nextUrl={DASHBOARD_URL} /> },
    ],
  },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
