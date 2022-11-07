import {
  ADD_ACCOUNT_PASSWORD_URL,
  ADD_ACCOUNT_SEED_INFO_URL,
  ADD_ACCOUNT_SEED_VALUE_URL,
  ADD_ACCOUNT_SEED_VERIFY_URL,
  ADD_ACCOUNT_SUCCESS_URL,
  APP_URL,
  CREATE_ACCOUNT_PASSWORD_URL,
  CREATE_ACCOUNT_SEED_INFO_URL,
  CREATE_ACCOUNT_SEED_VALUE_URL,
  CREATE_ACCOUNT_SEED_VERIFY_URL,
  CREATE_ACCOUNT_SUCCESS_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_URL,
  IMPORT_ACCOUNT_PASSWORD_URL,
  IMPORT_ACCOUNT_SEED_INFO_URL,
  IMPORT_ACCOUNT_SEED_INPUT_URL,
  IMPORT_ACCOUNT_SUCCESS_URL,
  NEW_ACCOUNT_ADD_URL,
  NEW_ACCOUNT_ADD_TAB_URL,
  NEW_ACCOUNT_CREATE_URL,
  NEW_ACCOUNT_IMPORT_URL,
  NEW_ACCOUNT_RECOVER_URL,
  NEW_ACCOUNT_SUB_URL,
  RECOVER_ACCOUNT_PASSWORD_URL,
  RECOVER_ACCOUNT_SEED_INFO_URL,
  RECOVER_ACCOUNT_SEED_INPUT_URL,
  RECOVER_ACCOUNT_SUCCESS_URL,
  SUB_ACCOUNT_PASSWORD_URL,
  SUB_ACCOUNT_SUCCESS_URL,
} from 'consts';
import {
  NewAccountAuth,
  NewAccountName,
  NewAccountNameTab,
  NewAccountPassword,
  NewAccountPasswordTab,
  NewAccountSuccess,
  NewAccountSuccessTab,
  SeedphraseInfo,
  SeedphraseInfoTab,
  SeedphraseInput,
  SeedphraseValue,
  SeedphraseValueTab,
  SeedphraseVerify,
  SeedphraseVerifyTab,
} from 'Page';

// 5 different ways to create a new account (create, recover, sub, add, import)
// 1) Create a new wallet (create) [landing page]
// 2) Recover wallet from seed phrase (recover) [landing page]
// 3) Add sub account (sub) [on dashboard menu]
// 4) Add additional account (add) [on dashboard menu]
// 5) Import existing account from seed phrase (import) [on dashboard menu]

// ---------------
// CREATE WALLET
// ---------------
export const NEW_ACCOUNT_CREATE = {
  path: NEW_ACCOUNT_CREATE_URL,
  element: <NewAccountAuth flowType="create" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountName
          progress={16}
          previousUrl={APP_URL}
          nextUrl={CREATE_ACCOUNT_SEED_INFO_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo
          progress={32}
          previousUrl={NEW_ACCOUNT_CREATE_URL}
          nextUrl={CREATE_ACCOUNT_SEED_VALUE_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_VALUE_URL,
      element: (
        <SeedphraseValue
          progress={48}
          previousUrl={CREATE_ACCOUNT_SEED_INFO_URL}
          nextUrl={CREATE_ACCOUNT_SEED_VERIFY_URL}
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_VERIFY_URL,
      element: (
        <SeedphraseVerify
          progress={64}
          previousUrl={CREATE_ACCOUNT_SEED_VALUE_URL}
          nextUrl={CREATE_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          progress={80}
          previousUrl={CREATE_ACCOUNT_SEED_VERIFY_URL}
          nextUrl={CREATE_ACCOUNT_SUCCESS_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess nextUrl={DASHBOARD_URL} flowType="create" />,
    },
  ],
};

// ----------------
// RECOVER WALLET
// ----------------
export const NEW_ACCOUNT_RECOVER = {
  path: NEW_ACCOUNT_RECOVER_URL,
  element: <NewAccountAuth flowType="recover" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountName
          progress={20}
          previousUrl={APP_URL}
          nextUrl={RECOVER_ACCOUNT_SEED_INFO_URL}
          flowType="recover"
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo
          progress={40}
          previousUrl={NEW_ACCOUNT_RECOVER_URL}
          nextUrl={RECOVER_ACCOUNT_SEED_INPUT_URL}
          flowType="recover"
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SEED_INPUT_URL,
      element: (
        <SeedphraseInput
          progress={60}
          previousUrl={RECOVER_ACCOUNT_SEED_INFO_URL}
          nextUrl={RECOVER_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          progress={80}
          previousUrl={RECOVER_ACCOUNT_SEED_INPUT_URL}
          nextUrl={RECOVER_ACCOUNT_SUCCESS_URL}
          flowType="recover"
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess nextUrl={DASHBOARD_URL} flowType="recover" />,
    },
  ],
};

// -------------
// SUB ACCOUNT
// -------------
export const NEW_ACCOUNT_SUB = {
  path: NEW_ACCOUNT_SUB_URL,
  element: <NewAccountAuth flowType="sub" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountName
          progress={33}
          previousUrl={DASHBOARD_MENU_URL}
          nextUrl={SUB_ACCOUNT_PASSWORD_URL}
          flowType="sub"
        />
      ),
    },
    {
      path: SUB_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          progress={66}
          previousUrl={NEW_ACCOUNT_SUB_URL}
          nextUrl={SUB_ACCOUNT_SUCCESS_URL}
          flowType="sub"
        />
      ),
    },
    {
      path: SUB_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess nextUrl={DASHBOARD_MENU_URL} flowType="sub" />,
    },
  ],
};

// -------------
// ADD ACCOUNT
// -------------
export const NEW_ACCOUNT_ADD = {
  path: NEW_ACCOUNT_ADD_URL,
  element: <NewAccountAuth flowType="add" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountName
          progress={16}
          previousUrl={DASHBOARD_MENU_URL}
          nextUrl={ADD_ACCOUNT_SEED_INFO_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo
          progress={32}
          previousUrl={NEW_ACCOUNT_ADD_URL}
          nextUrl={ADD_ACCOUNT_SEED_VALUE_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VALUE_URL,
      element: (
        <SeedphraseValue
          progress={48}
          previousUrl={ADD_ACCOUNT_SEED_INFO_URL}
          nextUrl={ADD_ACCOUNT_SEED_VERIFY_URL}
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VERIFY_URL,
      element: (
        <SeedphraseVerify
          progress={64}
          previousUrl={ADD_ACCOUNT_SEED_VALUE_URL}
          nextUrl={ADD_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: ADD_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          progress={80}
          previousUrl={ADD_ACCOUNT_SEED_VERIFY_URL}
          nextUrl={ADD_ACCOUNT_SUCCESS_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess nextUrl={DASHBOARD_MENU_URL} flowType="add" />,
    },
  ],
};

// -------------
// ADD ACCOUNT
// -------------
export const NEW_ACCOUNT_ADD_TAB = {
  path: NEW_ACCOUNT_ADD_TAB_URL,
  children: [
    {
      index: true,
      element: (
        <NewAccountNameTab
          progress={16}
          nextUrl={ADD_ACCOUNT_SEED_INFO_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfoTab
          progress={32}
          previousUrl={NEW_ACCOUNT_ADD_URL}
          nextUrl={ADD_ACCOUNT_SEED_VALUE_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VALUE_URL,
      element: (
        <SeedphraseValueTab
          progress={48}
          previousUrl={ADD_ACCOUNT_SEED_INFO_URL}
          nextUrl={ADD_ACCOUNT_SEED_VERIFY_URL}
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VERIFY_URL,
      element: (
        <SeedphraseVerifyTab
          progress={64}
          previousUrl={ADD_ACCOUNT_SEED_VALUE_URL}
          nextUrl={ADD_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: ADD_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPasswordTab
          progress={80}
          previousUrl={ADD_ACCOUNT_SEED_VERIFY_URL}
          nextUrl={ADD_ACCOUNT_SUCCESS_URL}
          flowType="add"
        />
      ),
    },
    {
      path: ADD_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccessTab nextUrl={DASHBOARD_MENU_URL} flowType="add" />,
    },
  ],
};

// -----------------
// IMPORT ACCOUNT
// -----------------
export const NEW_ACCOUNT_IMPORT = {
  path: NEW_ACCOUNT_IMPORT_URL,
  element: <NewAccountAuth flowType="import" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountName
          progress={20}
          previousUrl={DASHBOARD_MENU_URL}
          nextUrl={IMPORT_ACCOUNT_SEED_INFO_URL}
          flowType="import"
        />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo
          progress={40}
          previousUrl={NEW_ACCOUNT_IMPORT_URL}
          nextUrl={IMPORT_ACCOUNT_SEED_INPUT_URL}
          flowType="import"
        />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SEED_INPUT_URL,
      element: (
        <SeedphraseInput
          progress={60}
          previousUrl={IMPORT_ACCOUNT_SEED_INFO_URL}
          nextUrl={IMPORT_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: IMPORT_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          progress={80}
          previousUrl={IMPORT_ACCOUNT_SEED_INPUT_URL}
          nextUrl={IMPORT_ACCOUNT_SUCCESS_URL}
          flowType="import"
        />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess nextUrl={DASHBOARD_MENU_URL} flowType="import" />,
    },
  ],
};
