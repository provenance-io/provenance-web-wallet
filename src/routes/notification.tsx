import { NOTIFICATION_URL } from 'consts';
import { Page, Notification } from 'Page';

export const NOTIFICATION = {
  path: NOTIFICATION_URL,
  element: <Page bgImage height="100%" />,
  children: [{ index: true, element: <Notification /> }],
};
