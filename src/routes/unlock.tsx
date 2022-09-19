import { UNLOCK_URL, DASHBOARD_URL } from 'consts';
import { Unlock, Page } from 'Page';

export const UNLOCK = {
  path: UNLOCK_URL,
  element: <Page />,
  children: [{ index: true, element: <Unlock nextUrl={DASHBOARD_URL} /> }],
};
