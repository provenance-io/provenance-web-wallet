import {
  ADD_ACCOUNT_PASSWORD_URL,
  ADD_ACCOUNT_SEED_INFO_URL,
  ADD_ACCOUNT_SEED_VALUE_URL,
  ADD_ACCOUNT_SEED_VERIFY_URL,
  ADD_ACCOUNT_SUCCESS_URL,
  NEW_ACCOUNT_ADD_URL,
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

// -------------
// ADD ACCOUNT
// -------------
export const NEW_ACCOUNT_ADD = {
  path: NEW_ACCOUNT_ADD_URL,
  element: <NewAccountAuth flowType="add" />,
  children: [
    {
      index: true,
      element: <NewAccountName nextUrl={ADD_ACCOUNT_SEED_INFO_URL} flowType="add" />,
    },
    {
      path: ADD_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo nextUrl={ADD_ACCOUNT_SEED_VALUE_URL} flowType="add" />
      ),
    },
    {
      path: ADD_ACCOUNT_SEED_VALUE_URL,
      element: <SeedphraseValue nextUrl={ADD_ACCOUNT_SEED_VERIFY_URL} />,
    },
    {
      path: ADD_ACCOUNT_SEED_VERIFY_URL,
      element: <SeedphraseVerify nextUrl={ADD_ACCOUNT_PASSWORD_URL} />,
    },
    {
      path: ADD_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword nextUrl={ADD_ACCOUNT_SUCCESS_URL} flowType="add" />
      ),
    },
    {
      path: ADD_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess flowType="add" />,
    },
  ],
};
