import { WCNotification } from './WalletConnect';

export type ExtensionTypes = 'extension' | 'browser' | '';

type PageNotification = 'failed' | 'complete' | 'eol';

export type NotificationType = PageNotification | WCNotification;
