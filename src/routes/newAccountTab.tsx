import {
  ADD_ACCOUNT_PASSWORD_URL,
  ADD_ACCOUNT_SEED_INFO_URL,
  ADD_ACCOUNT_SEED_VALUE_URL,
  ADD_ACCOUNT_SEED_VERIFY_URL,
  ADD_ACCOUNT_SUCCESS_URL,
  CREATE_ACCOUNT_PASSWORD_URL,
  CREATE_ACCOUNT_SEED_INFO_URL,
  CREATE_ACCOUNT_SEED_VALUE_URL,
  CREATE_ACCOUNT_SEED_VERIFY_URL,
  CREATE_ACCOUNT_SUCCESS_URL,
  NEW_ACCOUNT_ADD_URL,
  NEW_ACCOUNT_CREATE_URL,
} from 'consts';
import {
  NewAccountAuthTab,
  NewAccountNameTab,
  NewAccountPasswordTab,
  NewAccountSuccessTab,
  SeedphraseInfoTab,
  SeedphraseValueTab,
  SeedphraseVerifyTab,
} from 'Page';

// These are all ment to be open in a new browser tab instead of being open within the extension popup window

// ---------------
// CREATE WALLET
// ---------------
export const NEW_ACCOUNT_CREATE_TAB = {
  path: NEW_ACCOUNT_CREATE_URL,
  element: <NewAccountAuthTab flowType="create" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountNameTab
          nextUrl={CREATE_ACCOUNT_SEED_INFO_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfoTab
          nextUrl={CREATE_ACCOUNT_SEED_VALUE_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_VALUE_URL,
      element: <SeedphraseValueTab nextUrl={CREATE_ACCOUNT_SEED_VERIFY_URL} />,
    },
    {
      path: CREATE_ACCOUNT_SEED_VERIFY_URL,
      element: (
        <SeedphraseVerifyTab
          progress={64}
          previousUrl={CREATE_ACCOUNT_SEED_VALUE_URL}
          nextUrl={CREATE_ACCOUNT_PASSWORD_URL}
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPasswordTab
          nextUrl={CREATE_ACCOUNT_SUCCESS_URL}
          flowType="create"
        />
      ),
    },
    {
      path: CREATE_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccessTab flowType="create" />,
    },
  ],
};

// -------------
// ADD ACCOUNT
// -------------
export const NEW_ACCOUNT_ADD_TAB = {
  path: NEW_ACCOUNT_ADD_URL,
  element: <NewAccountAuthTab flowType="add" />,
  children: [
    {
      index: true,
      element: (
        <NewAccountNameTab nextUrl={ADD_ACCOUNT_SEED_INFO_URL} flowType="add" />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfoTab nextUrl={ADD_ACCOUNT_SEED_VALUE_URL} flowType="add" />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VALUE_URL,
      element: <SeedphraseValueTab nextUrl={ADD_ACCOUNT_SEED_VERIFY_URL} />,
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
        <NewAccountPasswordTab nextUrl={ADD_ACCOUNT_SUCCESS_URL} flowType="add" />
      ),
    },
    {
      path: ADD_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccessTab flowType="add" />,
    },
  ],
};
