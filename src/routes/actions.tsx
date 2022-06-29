import { ACTIONS_URL } from 'consts';
import { Actions, Page } from 'Page';

export const ACTIONS = {
  path: ACTIONS_URL,
  element: <Page />,
  children: [
    { index: true, element: <Actions /> },
  ],
};
