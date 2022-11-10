import {
  NEW_ACCOUNT_SUB_URL,
  SUB_ACCOUNT_PASSWORD_URL,
  SUB_ACCOUNT_SUCCESS_URL,
} from 'consts';
import {
  NewAccountAuth,
  NewAccountName,
  NewAccountPassword,
  NewAccountSuccess,
} from 'Page';

// These are all ment to be open in a new browser tab instead of being open within the extension popup window

// -------------
// SUB ACCOUNT
// -------------
export const NEW_ACCOUNT_SUB = {
  path: NEW_ACCOUNT_SUB_URL,
  element: <NewAccountAuth flowType="sub" />,
  children: [
    {
      index: true,
      element: <NewAccountName nextUrl={SUB_ACCOUNT_PASSWORD_URL} flowType="sub" />,
    },
    {
      path: SUB_ACCOUNT_PASSWORD_URL,
      element: (
        <NewAccountPassword nextUrl={SUB_ACCOUNT_SUCCESS_URL} flowType="sub" />
      ),
    },
    {
      path: SUB_ACCOUNT_SUCCESS_URL,
      element: <NewAccountSuccess flowType="sub" />,
    },
  ],
};
