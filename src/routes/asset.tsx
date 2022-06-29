import { ASSET_URL } from 'consts';
import { Page, Asset } from 'Page';

export const ASSET = {
  path: ASSET_URL,
  element: <Page bgImage />,
  children: [
    { index: true, element: <Asset /> },
  ],
};
