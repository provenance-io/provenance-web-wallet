import {
  Actions,
  Asset,
  Connect,
  CreateAuth,
  CreateComplete,
  CreatePassword,
  CreateStart,
  Dashboard,
  DashboardAccountCreate,
  DashboardConnectionDetails,
  DashboardMenu,
  DashboardReceive,
  DashboardSend,
  EnterSeed,
  Landing,
  Notification,
  Page,
  Profile,
  RecoverAccountName,
  RecoverNote,
  RecoverPassword,
  RequiresAuth,
  ResetWallets,
  Seedphrase,
  SeedphraseIntro,
  Transactions,
  TransactionDetails,
  Unlock,
  UnlockAuth,
  VerifySeedphrase,
} from 'Page';
import {
  ACTIONS_URL,
  APP_URL,
  ASSET_URL,
  CONNECT_URL,
  CREATE_COMPLETE_URL,
  CREATE_PASSWORD_URL,
  CREATE_SEEDPHRASE_INTRO_URL,
  CREATE_SEEDPHRASE_URL,
  CREATE_URL,
  CREATE_VERIFY_SEEDPHRASE_URL,
  DASHBOARD_ACCOUNT_CREATE_URL,
  DASHBOARD_CONNECTION_DETAILS_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_RECEIVE_URL,
  DASHBOARD_SEND_URL,
  DASHBOARD_URL,
  NOTIFICATION_URL,
  PROFILE_URL,
  RECOVER_NOTE_URL,
  RECOVER_PASSWORD_URL,
  RECOVER_SEED_URL,
  RECOVER_URL,
  RESET_WALLETS_URL,
  TRANSACTIONS_URL,
  TRADE_DETAILS_URL,
  UNLOCK_URL,
} from 'consts';

export const routes = [
  {
    path: APP_URL,
    element: (
      <RequiresAuth />
    ),
    children: [
      // LANDING PAGE
      { index: true, element: <Page bgImage align="center"><Landing /></Page> },
      // DASHBOARD
      {
        path: DASHBOARD_URL,
        element: <Page />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: DASHBOARD_SEND_URL, element: <DashboardSend /> },
          { path: DASHBOARD_RECEIVE_URL, element: <DashboardReceive /> },
          { path: DASHBOARD_MENU_URL, element: <DashboardMenu /> },
          { path: DASHBOARD_ACCOUNT_CREATE_URL, element: <DashboardAccountCreate  nextUrl={DASHBOARD_MENU_URL} /> },
          { path: DASHBOARD_CONNECTION_DETAILS_URL, element: <DashboardConnectionDetails /> },
        ]
      },
      // ACTIONS
      {
        path: ACTIONS_URL,
        element: <Page />,
        children: [
          { index: true, element: <Actions /> },
        ],
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
          { path: TRADE_DETAILS_URL, element: <TransactionDetails /> },
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
      // WALLETCONNECT CONNECTION
      {
        path: CONNECT_URL,
        element: <Page bgImage/>,
        children: [
          { index: true, element: <Connect /> },
        ],
      },
    ],
  },
  // RECOVER WALLET
  {
    path: RECOVER_URL,
    element: <Page align='center'/>,
    children: [
      { index: true, element: <RecoverAccountName nextUrl={RECOVER_NOTE_URL} /> },
      {
        path: RECOVER_NOTE_URL,
        element: <RecoverNote nextUrl={RECOVER_SEED_URL} />,
      },
      {
        path: RECOVER_SEED_URL,
        element: <EnterSeed nextUrl={RECOVER_PASSWORD_URL} />,
      },
      {
        path: RECOVER_PASSWORD_URL,
        element: <RecoverPassword nextUrl={DASHBOARD_URL} />,
      },
    ]
  },
  // CREATE WALLET
  {
    path: CREATE_URL,
    element: <CreateAuth />,
    children: [
      { index: true, element: <CreateStart nextUrl={CREATE_SEEDPHRASE_INTRO_URL} /> },
      {
        path: CREATE_SEEDPHRASE_INTRO_URL,
        element: <SeedphraseIntro nextUrl={CREATE_SEEDPHRASE_URL} />,
      },
      {
        path: CREATE_SEEDPHRASE_URL,
        element: <Seedphrase nextUrl={CREATE_VERIFY_SEEDPHRASE_URL} />,
      },
      {
        path: CREATE_VERIFY_SEEDPHRASE_URL,
        element: <VerifySeedphrase nextUrl={CREATE_PASSWORD_URL} />,
      },
      {
        path: CREATE_PASSWORD_URL,
        element: <CreatePassword nextUrl={CREATE_COMPLETE_URL} />,
      },
      { path: CREATE_COMPLETE_URL, element: <CreateComplete nextUrl={DASHBOARD_URL} /> },
    ],
  },
  {
    path: UNLOCK_URL,
    element: <UnlockAuth />,
    children: [
      { index: true, element: <Unlock nextUrl={DASHBOARD_URL} /> },
    ]
  },
  {
    path: NOTIFICATION_URL,
    element: <Page bgImage/>,
    children: [
      { index: true, element: <Notification /> },
    ],
  }
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
