// API URLS
export const SERVICE_MOBILE_WALLET = process.env.REACT_APP_SERVICE_MOBILE_WALLET;
export const ADDRESS_URL = `${SERVICE_MOBILE_WALLET}/address`;
export const PRICING_URL = `${SERVICE_MOBILE_WALLET}/pricing`;
export const STATISTICS_URL = `${SERVICE_MOBILE_WALLET}/statistics`;
export const MARKER_URL = `${PRICING_URL}/marker`;
// INNER-APP PATH URLS
// -- MAIN URLS
export const APP_URL = '/';
// -- DASHBOARD URLS
export const DASHBOARD_URL = '/dashboard';
export const DASHBOARD_MENU_URL = '/dashboard/menu';
export const DASHBOARD_SEND_URL = '/dashboard/send';
export const DASHBOARD_RECEIVE_URL = '/dashboard/receive';
// -- PROFILE URLS
export const PROFILE_URL = '/profile';
export const RESET_WALLETS_URL = '/profile/reset-wallets';
// -- TRANSACTION URLS
export const TRANSACTIONS_URL = '/transactions';
export const TRADE_DETAILS_URL = '/trade-details';
export const TRANSACTION_COMPLETE_URL = '/transaction-complete';
// -- RECOVER URLS
export const RECOVER_URL = '/recover';
export const RECOVER_NOTE_URL = '/recover/note';
export const RECOVER_SEED_URL = '/recover/seed';
// -- ASSET URLS
export const ASSET_URL = '/asset/:assetName';
// -- CONFIRMATION
export const CONFIRM_URL = '/confirm';
export const CONNECT_REQUEST_URL = '/connect';
// -- CONNECTION
export const CONNECT_SUCCESS_URL = '/connect-success';
export const CONNECT_DETAILS_URL = '/connect-details';
// -- CREATE URLS
export const CREATE_URL = '/create';
export const CREATE_PASSPHRASE_INTRO_URL = '/create/passphrase-intro';
export const CREATE_PASSPHRASE_URL = '/create/passphrase';
export const CREATE_VERIFY_PASSPHRASE_URL = '/create/verify-passphrase';
export const CREATE_COMPLETE_URL = '/create/complete';