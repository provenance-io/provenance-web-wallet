import { SEND_URL } from 'consts';
import { Page, Send } from 'Page';

export const SEND = {
  path: SEND_URL,
  element: <Page />,
  children: [
    { index: true, element: <Send /> },
  ],
};
