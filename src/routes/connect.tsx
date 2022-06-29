import { CONNECT_URL } from 'consts';
import { Page, Connect } from 'Page';

export const CONNECT = {
  path: CONNECT_URL,
  element: <Page bgImage/>,
  children: [
    { index: true, element: <Connect /> },
  ],
};
