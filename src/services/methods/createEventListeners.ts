import { WalletConnectClient } from 'types';

export const createEventListeners = (connector: WalletConnectClient) => {
  connector.on("wc_sessionRequest", (error, payload) => {
    console.log('wc_sessionRequest EVENT: ', payload, error);
  });
  connector.on("wc_sessionUpdate", (error, payload) => {
    console.log('wc_sessionUpdate EVENT: ', payload, error);
  });
  connector.on("connect", (error, payload) => {
    console.log('CONNECT EVENT: ', payload, error);
  });
  connector.on("exchange_key", (error, payload) => {
    console.log('exchange_key EVENT: ', payload, error);
  });
  connector.on("disconnect", (error, payload) => {
    console.log('disconnect EVENT: ', payload, error);
  });
  connector.on("display_uri", (error, payload) => {
    console.log('display_uri EVENT: ', payload, error);
  });
  connector.on("modal_closed", (error, payload) => {
    console.log('modal_closed EVENT: ', payload, error);
  });
  connector.on("transport_open", (error, payload) => {
    console.log('transport_open EVENT: ', payload, error);
  });
  connector.on("transport_close", (error, payload) => {
    console.log('transport_close EVENT: ', payload, error);
  });
  connector.on("transport_error", (error, payload) => {
    console.log('transport_error EVENT: ', payload, error);
  });
  connector.on("session_request", (error, payload) => {
    connector.approveSession(payload);
    console.log('SESSION_REQUEST EVENT: ', payload, error);
  });
  connector.on("session_update", (error, payload) => {
    console.log('session_update EVENT: ', payload, error);
  });
};
