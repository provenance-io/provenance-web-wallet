import { PROFILE_URL } from 'consts';
import { Page, Profile } from 'Page';

export const PROFILE = {
  path: PROFILE_URL,
  element: <Page />,
  children: [
    { index: true, element: <Profile /> },
  ],
};
