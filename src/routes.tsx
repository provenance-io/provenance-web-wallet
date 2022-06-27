import {
  Actions,
  Asset,
  Connect,
  Dashboard,
  DashboardConnectionDetails,
  DashboardMenu,
  DashboardReceive,
  DashboardSend,
  Landing,
  NewAccountAuth,
  NewAccountName,
  NewAccountPassword,
  NewAccountSuccess,
  Notification,
  Page,
  Profile,
  RequiresAuth,
  ResetWallets,
  SeedphraseInfo,
  SeedphraseInput,
  SeedphraseValue,
  SeedphraseVerify,
  Transactions,
  Unlock,
  UnlockAuth,
} from 'Page';
import {
  ACTIONS_URL,
  ADD_ACCOUNT_PASSWORD_URL,
  ADD_ACCOUNT_SUCCESS_URL,
  APP_URL,
  ASSET_URL,
  CONNECT_URL,
  CREATE_ACCOUNT_PASSWORD_URL,
  CREATE_ACCOUNT_SEED_INFO_URL,
  CREATE_ACCOUNT_SEED_VALUE_URL,
  CREATE_ACCOUNT_SEED_VERIFY_URL,
  CREATE_ACCOUNT_SUCCESS_URL,
  DASHBOARD_CONNECTION_DETAILS_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_RECEIVE_URL,
  DASHBOARD_SEND_URL,
  DASHBOARD_URL,
  NEW_ACCOUNT_ADD_URL,
  NEW_ACCOUNT_CREATE_URL,
  NEW_ACCOUNT_RECOVER_URL,
  NOTIFICATION_URL,
  PROFILE_URL,
  RECOVER_ACCOUNT_PASSWORD_URL,
  RECOVER_ACCOUNT_SEED_INFO_URL,
  RECOVER_ACCOUNT_SEED_INPUT_URL,
  RECOVER_ACCOUNT_SUCCESS_URL,
  RESET_WALLETS_URL,
  TRANSACTIONS_URL,
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
  // NEW ACCOUNT -- RECOVER ACCOUNT
  {
    path: NEW_ACCOUNT_RECOVER_URL,
    element: <NewAccountAuth flowType='recover' />,
    children: [
      { index: true, element: <NewAccountName progress={20} previousUrl={APP_URL} nextUrl={RECOVER_ACCOUNT_SEED_INFO_URL} flowType='recover' /> },
      {
        path: RECOVER_ACCOUNT_SEED_INFO_URL,
        element: <SeedphraseInfo progress={40} previousUrl={NEW_ACCOUNT_RECOVER_URL} nextUrl={RECOVER_ACCOUNT_SEED_INPUT_URL} flowType='recover' />,
      },
      {
        path: RECOVER_ACCOUNT_SEED_INPUT_URL,
        element: <SeedphraseInput progress={60} previousUrl={RECOVER_ACCOUNT_SEED_INFO_URL} nextUrl={RECOVER_ACCOUNT_PASSWORD_URL} />,
      },
      {
        path: RECOVER_ACCOUNT_PASSWORD_URL,
        element: <NewAccountPassword progress={80} previousUrl={RECOVER_ACCOUNT_SEED_INPUT_URL} nextUrl={RECOVER_ACCOUNT_SUCCESS_URL} flowType='recover' />,
      },
      {
        path: RECOVER_ACCOUNT_SUCCESS_URL,
        element: <NewAccountSuccess nextUrl={DASHBOARD_URL} flowType='recover' />,
      },
    ]
  },
  // NEW ACCOUNT -- CREATE WALLET
  {
    path: NEW_ACCOUNT_CREATE_URL,
    element: <NewAccountAuth flowType='create' />,
    children: [
      { index: true, element: <NewAccountName progress={16} previousUrl={APP_URL} nextUrl={CREATE_ACCOUNT_SEED_INFO_URL} flowType='create' /> },
      {
        path: CREATE_ACCOUNT_SEED_INFO_URL,
        element: <SeedphraseInfo progress={32} previousUrl={NEW_ACCOUNT_CREATE_URL} nextUrl={CREATE_ACCOUNT_SEED_VALUE_URL} flowType='create' />,
      },
      {
        path: CREATE_ACCOUNT_SEED_VALUE_URL,
        element: <SeedphraseValue progress={48} previousUrl={CREATE_ACCOUNT_SEED_INFO_URL} nextUrl={CREATE_ACCOUNT_SEED_VERIFY_URL} />,
      },
      {
        path: CREATE_ACCOUNT_SEED_VERIFY_URL,
        element: <SeedphraseVerify progress={64} previousUrl={CREATE_ACCOUNT_SEED_VALUE_URL} nextUrl={CREATE_ACCOUNT_PASSWORD_URL} />,
      },
      {
        path: CREATE_ACCOUNT_PASSWORD_URL,
        element: <NewAccountPassword progress={80} previousUrl={CREATE_ACCOUNT_SEED_VERIFY_URL} nextUrl={CREATE_ACCOUNT_SUCCESS_URL} flowType='create' />,
      },
      {
        path: CREATE_ACCOUNT_SUCCESS_URL,
        element: <NewAccountSuccess nextUrl={DASHBOARD_URL} flowType='create' />,
      },
    ]
  },
  // NEW ACCOUNT -- ADD ACCOUNT
  {
    path: NEW_ACCOUNT_ADD_URL,
    element: <NewAccountAuth flowType='add' />,
    children: [
      { index: true, element: <NewAccountName progress={33} previousUrl={DASHBOARD_MENU_URL} nextUrl={ADD_ACCOUNT_PASSWORD_URL} flowType='add' /> },
      {
        path: ADD_ACCOUNT_PASSWORD_URL,
        element: <NewAccountPassword progress={66} previousUrl={NEW_ACCOUNT_ADD_URL} nextUrl={ADD_ACCOUNT_SUCCESS_URL} flowType='add' />,
      },
      {
        path: ADD_ACCOUNT_SUCCESS_URL,
        element: <NewAccountSuccess nextUrl={DASHBOARD_MENU_URL} flowType='add' />,
      },
    ]
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
