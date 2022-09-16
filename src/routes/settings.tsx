import { SETTINGS_URL, ADVANCED_SETTINGS_URL } from 'consts';
import { Page, Settings, AdvancedSettings } from 'Page';

export const SETTINGS = {
  path: SETTINGS_URL,
  element: <Page />,
  children: [
    { index: true, element: <Settings /> },
    { path: ADVANCED_SETTINGS_URL, element: <AdvancedSettings /> },
  ],
};
