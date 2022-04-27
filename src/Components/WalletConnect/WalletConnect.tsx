import { useEffect, useState } from 'react';
import WC from "@walletconnect/client";
import { Button } from 'Components';

export const WalletConnect:React.FC = () => {
  const [connector, setConnector] = useState<WC | null>(null);
  // Initial load
  useEffect(() => {
    // These values need to come from the URL/QRCode/dAPP
    const WCOptions = {
      clientMeta: {
        description: "TEST | WalletConnect Developer App",
        url: "https://walletconnect.org",
        icons: ["https://walletconnect.org/walletconnect-logo.png"],
        name: "TEST | WalletConnect",
      },
      uri: 'wc:325be01b-3b95-49b1-b95b-bb238180f149@1?bridge=wss%3A%2F%2Ftest.figure.tech%2Fservice-wallet-connect-bridge%2Fws%2Fexternal&key=45bd3efd1d9fcf62a7ba3318ab9741bba7965b6c96b217808b0e5096c55e9dee',
    }
    const newConnector = new WC(WCOptions);
    console.log('connector: ', newConnector);
    if (!newConnector.connected) {
      console.log('new connector not connected, creating a new session');
      // Create events
      newConnector.on("wc_sessionRequest", (error, payload) => {
        console.log('wc_sessionRequest EVENT: ', payload, error);
      });
      newConnector.on("wc_sessionUpdate", (error, payload) => {
        console.log('wc_sessionUpdate EVENT: ', payload, error);
      });
      newConnector.on("connect", (error, payload) => {
        console.log('CONNECT EVENT: ', payload, error);
      });
      newConnector.on("exchange_key", (error, payload) => {
        console.log('exchange_key EVENT: ', payload, error);
      });
      newConnector.on("disconnect", (error, payload) => {
        console.log('disconnect EVENT: ', payload, error);
      });
      newConnector.on("display_uri", (error, payload) => {
        console.log('display_uri EVENT: ', payload, error);
      });
      newConnector.on("modal_closed", (error, payload) => {
        console.log('modal_closed EVENT: ', payload, error);
      });
      newConnector.on("transport_open", (error, payload) => {
        console.log('transport_open EVENT: ', payload, error);
      });
      newConnector.on("transport_close", (error, payload) => {
        console.log('transport_close EVENT: ', payload, error);
      });
      newConnector.on("transport_error", (error, payload) => {
        console.log('transport_error EVENT: ', payload, error);
      });
      newConnector.on("session_request", (error, payload) => {
        console.log('SESSION_REQUEST EVENT: ', payload, error);
      });
      newConnector.on("session_update", (error, payload) => {
        console.log('session_update EVENT: ', payload, error);
      });


      // newConnector.approveSession({
      //   chainId: 1,
      //   accounts: ['tp1em54692jvxfkzcww9p06u0t098cl547lwjv6nw'],
      // });
      newConnector.createSession();
      // Approve Call Request
      // newConnector.approveRequest({
      //   id: 1,
      //   result: "45bd3efd1d9fcf62a7ba3318ab9741bba7965b6c96b217808b0e5096c55e9dee",
      //   jsonrpc: '2.0',
      // });
    }
    setConnector(newConnector);
  }, []);

  return (
    <div>
      {connector?.connected ? (
        <>
          WalletConnect Connected!
          <Button onClick={() => connector.killSession({message: 'User Killed Session'})}>Disconnect</Button>
        </>
      ) : 'Unable to connect..'}
    </div>
  );
};
