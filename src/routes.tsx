// import { Navigate } from 'react-router-dom';
import {
  CreateComplete,
  CreateStart,
  Dashboard,
  EnterSeed,
  Landing,
  Login,
  Page,
  Passphrase,
  PassphraseIntro,
  RecoverNote,
  RecoverAccountName,
  RequiresAuth,
  VerifyPassphrase,
} from 'Page';

export const APP_URL = '/';
export const DASHBOARD_URL = '/dashboard';
export const LOGIN_URL = '/login';

// RECOVER URLS
export const RECOVER_URL = '/recover';
export const RECOVER_NOTE_URL = '/recover/note';
export const RECOVER_SEED_URL = '/recover/seed';

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
      <RequiresAuth>
        <Page />
      </RequiresAuth>
    ),
    children: [
      { index: true, element: <Landing /> },
      { path: DASHBOARD_URL, element: <Dashboard /> },
    ],
  },
  {
    path: LOGIN_URL,
    element: (
      <Page>
        <Login />
      </Page>
    ),
  },
  {
    path: RECOVER_URL,
    element: <Page />,
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
