import {
  NEW_ACCOUNT_RECOVER_URL,
  RECOVER_ACCOUNT_SEED_INFO_URL,
  RECOVER_ACCOUNT_SEED_INPUT_URL,
  RECOVER_ACCOUNT_PASSWORD_URL,
  RECOVER_ACCOUNT_SUCCESS_URL,
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
        <NewAccountName nextUrl={RECOVER_ACCOUNT_SEED_INFO_URL} flowType="recover" />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SEED_INFO_URL,
      element: (
        <SeedphraseInfo
          nextUrl={RECOVER_ACCOUNT_SEED_INPUT_URL}
          flowType="recover"
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SEED_INPUT_URL,
      element: <SeedphraseInput nextUrl={RECOVER_ACCOUNT_PASSWORD_URL} />,
    },
    {
      path: RECOVER_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword
          nextUrl={RECOVER_ACCOUNT_SUCCESS_URL}
          flowType="recover"
        />
      ),
    },
    {
      path: RECOVER_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess flowType="recover" />,
    },
  ],
};
