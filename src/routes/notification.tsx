import { NOTIFICATION_URL } from 'consts';
import { Page, Notification } from 'Page';

export const NOTIFICATION = {
  path: NOTIFICATION_URL,
  element: <Page bgImage/>,
  children: [
    { index: true, element: <Notification /> },
  ],
};
