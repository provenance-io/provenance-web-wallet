import { SEND_AMOUNT_URL, SEND_COMPLETE_URL, SEND_REVIEW_URL, SEND_URL } from 'consts';
import { Page, Send, SendAmount, SendReview, SendComplete } from 'Page';

export const SEND = {
  path: SEND_URL,
  element: <Page />,
  children: [
    { index: true, element: <Send /> },
    { path: SEND_AMOUNT_URL, element: <SendAmount /> },
    { path: SEND_REVIEW_URL, element: <SendReview /> },
    { path: SEND_COMPLETE_URL, element: <SendComplete /> },
  ],
};
