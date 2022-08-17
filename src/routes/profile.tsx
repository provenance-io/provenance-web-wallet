import { PROFILE_URL, ADVANCED_SETTINGS_URL } from 'consts';
import { Page, Profile, AdvancedSettings } from 'Page';

export const PROFILE = {
  path: PROFILE_URL,
  element: <Page />,
  children: [
    { index: true, element: <Profile /> },
    { path: ADVANCED_SETTINGS_URL, element: <AdvancedSettings /> },
  ],
};
