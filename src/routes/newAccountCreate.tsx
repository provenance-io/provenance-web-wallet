import {
  CREATE_ACCOUNT_PASSWORD_URL,
  CREATE_ACCOUNT_SEED_INFO_URL,
  CREATE_ACCOUNT_SEED_VALUE_URL,
  CREATE_ACCOUNT_SEED_VERIFY_URL,
  CREATE_ACCOUNT_SUCCESS_URL,
  NEW_ACCOUNT_CREATE_URL,
} from 'consts';
import {
  NewAccountAuth,
  NewAccountName,
  NewAccountPassword,
  NewAccountSuccess,
  SeedphraseInfo,
  SeedphraseValue,
  SeedphraseVerify,
} from 'Page';

// These are all ment to be open in a new browser tab instead of being open within the extension popup window

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
        <NewAccountName nextUrl={CREATE_ACCOUNT_SEED_INFO_URL} flowType="create" />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo nextUrl={CREATE_ACCOUNT_SEED_VALUE_URL} flowType="create" />
      ),
    },
    {
      path: CREATE_ACCOUNT_SEED_VALUE_URL,
      element: <SeedphraseValue nextUrl={CREATE_ACCOUNT_SEED_VERIFY_URL} />,
    },
    {
      path: CREATE_ACCOUNT_SEED_VERIFY_URL,
      element: <SeedphraseVerify nextUrl={CREATE_ACCOUNT_PASSWORD_URL} />,
    },
    {
      path: CREATE_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword nextUrl={CREATE_ACCOUNT_SUCCESS_URL} flowType="create" />
      ),
    },
    {
      path: CREATE_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess flowType="create" />,
    },
  ],
};
