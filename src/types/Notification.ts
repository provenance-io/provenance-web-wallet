import { WCNotification } from './WalletConnect';

export type ExtensionTypes = 'extension' | 'browser' | '';

type PageNotification = 'failed' | 'complete';

export type NotificationType = PageNotification | WCNotification;
