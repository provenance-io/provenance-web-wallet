// ---------------------
// EXTERNAL PATH URLS
// ---------------------
// PROVENANCE DOCS
export const PROVENANCE_WEB_URL = 'https://provenance.io';
export const PROVENANCE_WEB_DOCS_URL = 'https://docs.provenance.io';
export const PROVENANCE_DOCS_GAS_FEE = `${PROVENANCE_WEB_DOCS_URL}/blockchain/basics/gas-and-fees`;
// BLOCKCHAIN EXPLORER
export const EXPLORER_WEB_TESTNET = 'https://explorer.test.provenance.io';
export const EXPLORER_WEB_MAINNET = 'https://explorer.provenance.io';
export const EXPLORER_WEB_TX_HASH = `/tx`;
export const EXPLORER_WEB_BLOCK = `/block`;
// ---------------------
// INNER-APP PATH URLS
// ---------------------
// ROOT HOMEPAGE URL
export const APP_URL = '/';
// DASHBOARD URLS
export const DASHBOARD_URL = '/dashboard';
export const DASHBOARD_MENU_URL = `${DASHBOARD_URL}/menu`;
export const DASHBOARD_RECEIVE_URL = `${DASHBOARD_URL}/receive`;
export const DASHBOARD_CONNECTION_DETAILS_URL = `${DASHBOARD_URL}/connection`;
// -- SEND URLS
export const SEND_URL = '/send';
export const SEND_AMOUNT_URL = `${SEND_URL}/amount`;
export const SEND_REVIEW_URL = `${SEND_URL}/review`;
export const SEND_COMPLETE_URL = `${SEND_URL}/complete`;
// SETTINGS URLS
export const SETTINGS_URL = '/settings';
export const ADVANCED_SETTINGS_URL = `${SETTINGS_URL}/advanced-settings`;
// TRANSACTION URLS
export const TRANSACTIONS_URL = '/transactions';
export const TRANSACTION_DETAILS_URL = '/transaction';
// ACTIONS URLS
export const ACTIONS_URL = '/actions';
// ASSET URLS
export const ASSET_URL = '/asset/:assetName';
// CONNECTION
export const CONNECT_URL = '/connect';
// UNLOCK URLS
export const UNLOCK_URL = '/unlock';
// NOTIFICATIONS
export const NOTIFICATION_URL = '/notification';
// REMOVE ACCOUNT
export const REMOVE_ACCOUNT_URL = '/remove';
// RENAME ACCOUNT
export const RENAME_ACCOUNT_URL = '/rename';
// RESET WALLET
export const RESET_WALLET_URL = '/reset';

// ---------------------
// INNER-APP TAB URLS
// ---------------------
export const NEW_TAB_ROOT_URL = 'index.html';
// NEW ACCOUNT (ADD/CREATE/RECOVER/IMPORT)
export const NEW_ACCOUNT_URL = '/account';
const NEW_ACCOUNT_SEED_INFO = '/seed';
const NEW_ACCOUNT_SEED_VALUE = `${NEW_ACCOUNT_SEED_INFO}/value`;
const NEW_ACCOUNT_SEED_VERIFY = `${NEW_ACCOUNT_SEED_INFO}/verify`;
const NEW_ACCOUNT_SEED_INPUT = `${NEW_ACCOUNT_SEED_INFO}/input`;
const NEW_ACCOUNT_PASSWORD = '/password';
const NEW_ACCOUNT_SUCCESS = '/success';
// - CREATE
export const NEW_ACCOUNT_CREATE_URL = `${NEW_ACCOUNT_URL}/create`;
export const CREATE_ACCOUNT_SEED_INFO_URL = `${NEW_ACCOUNT_CREATE_URL}${NEW_ACCOUNT_SEED_INFO}`;
export const CREATE_ACCOUNT_SEED_VALUE_URL = `${NEW_ACCOUNT_CREATE_URL}${NEW_ACCOUNT_SEED_VALUE}`;
export const CREATE_ACCOUNT_SEED_VERIFY_URL = `${NEW_ACCOUNT_CREATE_URL}${NEW_ACCOUNT_SEED_VERIFY}`;
export const CREATE_ACCOUNT_PASSWORD_URL = `${NEW_ACCOUNT_CREATE_URL}${NEW_ACCOUNT_PASSWORD}`;
export const CREATE_ACCOUNT_SUCCESS_URL = `${NEW_ACCOUNT_CREATE_URL}${NEW_ACCOUNT_SUCCESS}`;
// - ADD
export const NEW_ACCOUNT_ADD_URL = `${NEW_ACCOUNT_URL}/add`;
export const ADD_ACCOUNT_SEED_INFO_URL = `${NEW_ACCOUNT_ADD_URL}${NEW_ACCOUNT_SEED_INFO}`;
export const ADD_ACCOUNT_SEED_VALUE_URL = `${NEW_ACCOUNT_ADD_URL}${NEW_ACCOUNT_SEED_VALUE}`;
export const ADD_ACCOUNT_SEED_VERIFY_URL = `${NEW_ACCOUNT_ADD_URL}${NEW_ACCOUNT_SEED_VERIFY}`;
export const ADD_ACCOUNT_PASSWORD_URL = `${NEW_ACCOUNT_ADD_URL}${NEW_ACCOUNT_PASSWORD}`;
export const ADD_ACCOUNT_SUCCESS_URL = `${NEW_ACCOUNT_ADD_URL}${NEW_ACCOUNT_SUCCESS}`;
// - RECOVER
export const NEW_ACCOUNT_RECOVER_URL = `${NEW_ACCOUNT_URL}/recover`;
export const RECOVER_ACCOUNT_SEED_INFO_URL = `${NEW_ACCOUNT_RECOVER_URL}${NEW_ACCOUNT_SEED_INFO}`;
export const RECOVER_ACCOUNT_SEED_INPUT_URL = `${NEW_ACCOUNT_RECOVER_URL}${NEW_ACCOUNT_SEED_INPUT}`;
export const RECOVER_ACCOUNT_PASSWORD_URL = `${NEW_ACCOUNT_RECOVER_URL}${NEW_ACCOUNT_PASSWORD}`;
export const RECOVER_ACCOUNT_SUCCESS_URL = `${NEW_ACCOUNT_RECOVER_URL}${NEW_ACCOUNT_SUCCESS}`;
// - SUB ACCOUNT
export const NEW_ACCOUNT_SUB_URL = `${NEW_ACCOUNT_URL}/sub`;
export const SUB_ACCOUNT_PASSWORD_URL = `${NEW_ACCOUNT_SUB_URL}${NEW_ACCOUNT_PASSWORD}`;
export const SUB_ACCOUNT_SUCCESS_URL = `${NEW_ACCOUNT_SUB_URL}${NEW_ACCOUNT_SUCCESS}`;
// - IMPORT
export const NEW_ACCOUNT_IMPORT_URL = `${NEW_ACCOUNT_URL}/import`;
export const IMPORT_ACCOUNT_SEED_INFO_URL = `${NEW_ACCOUNT_IMPORT_URL}${NEW_ACCOUNT_SEED_INFO}`;
export const IMPORT_ACCOUNT_SEED_INPUT_URL = `${NEW_ACCOUNT_IMPORT_URL}${NEW_ACCOUNT_SEED_INPUT}`;
export const IMPORT_ACCOUNT_PASSWORD_URL = `${NEW_ACCOUNT_IMPORT_URL}${NEW_ACCOUNT_PASSWORD}`;
export const IMPORT_ACCOUNT_SUCCESS_URL = `${NEW_ACCOUNT_IMPORT_URL}${NEW_ACCOUNT_SUCCESS}`;
