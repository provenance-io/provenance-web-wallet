import { UNLOCK_URL, DASHBOARD_URL } from 'consts';
import { UnlockAuth, Unlock } from 'Page';

export const UNLOCK = {
  path: UNLOCK_URL,
  element: <UnlockAuth />,
  children: [
    { index: true, element: <Unlock nextUrl={DASHBOARD_URL} /> },
  ]
};
