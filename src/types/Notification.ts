import type { WCNotification } from './WalletConnect';

export type ExtensionTypes = 'extension' | 'browser' | '';

type PageNotification =
  | 'failed'
  | 'complete'
  | 'missing_account'
  | 'already_connected';

export type NotificationType = PageNotification | WCNotification;
