import {
  NEW_ACCOUNT_IMPORT_URL,
  IMPORT_ACCOUNT_SEED_INFO_URL,
  IMPORT_ACCOUNT_SEED_INPUT_URL,
  IMPORT_ACCOUNT_PASSWORD_URL,
  IMPORT_ACCOUNT_SUCCESS_URL,
} from 'consts';
import {
  NewAccountAuth,
  NewAccountName,
  NewAccountPassword,
  NewAccountSuccess,
  SeedphraseInfo,
  SeedphraseInput,
} from 'Page';

// These are all ment to be open in a new browser tab instead of being open within the extension popup window

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
        <NewAccountName nextUrl={IMPORT_ACCOUNT_SEED_INFO_URL} flowType="import" />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo nextUrl={IMPORT_ACCOUNT_SEED_INPUT_URL} flowType="import" />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SEED_INPUT_URL,
      element: <SeedphraseInput nextUrl={IMPORT_ACCOUNT_PASSWORD_URL} />,
    },
    {
      path: IMPORT_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword nextUrl={IMPORT_ACCOUNT_SUCCESS_URL} flowType="import" />
      ),
    },
    {
      path: IMPORT_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess flowType="import" />,
    },
  ],
};
