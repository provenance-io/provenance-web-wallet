import { useEffect, useState } from 'react';
import WC from "@walletconnect/client";
import { Button } from 'Components';

export const WalletConnect:React.FC = () => {
  const [connector, setConnector] = useState<WC | null>(null);

  // Initial load
  useEffect(() => {
    // These values need to come from the URL/QRCode/dAPP
    const WCOptions = {
      // uri: 'wc:8a5e5bdc-a0e4-47...TJRNmhWJmoxdFo6UDk2WlhaOyQ5N0U=',
      clientMeta: {
        description: "TEST | WalletConnect Developer App",
        url: "https://walletconnect.org",
        icons: ["https://walletconnect.org/walletconnect-logo.png"],
        name: "TEST | WalletConnect",
      },
      uri: 'wc:325be01b-3b95-49b1-b95b-bb238180f149@1?bridge=wss%3A%2F%2Ftest.figure.tech%2Fservice-wallet-connect-bridge%2Fws%2Fexternal&key=45bd3efd1d9fcf62a7ba3318ab9741bba7965b6c96b217808b0e5096c55e9dee'
    }
    // const PushOptions = {
    //   // Optional
    //   url: "wss://test.figure.tech/service-wallet-connect-bridge/ws/external",
    //   type: "fcm",
    //   token: 'HASH',
    //   peerMeta: true,
    //   language: 'ENG',
    // }
    const newConnector = new WC(WCOptions);
    console.log('connector: ', newConnector);
    if (!newConnector.connected) {
      console.log('new connector not connected, creating a new session');
      newConnector.createSession({chainId: 1});
      newConnector.approveSession({chainId: 1, accounts: ['tp1em54692jvxfkzcww9p06u0t098cl547lwjv6nw']});
    }
    setConnector(newConnector);
  }, []);

  useEffect(() => {
    if (connector) {
      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }
        console.log('CONNECT EVENT');
      });
      // Subscribe to session requests
      connector.on("session_request", (error, payload) => {
        if (error) {
          throw error;
        }
        console.log('SESSION_REQUEST EVENT');
        // Handle Session Request
        /* payload:
        {
          id: 1,
          jsonrpc: '2.0'.
          method: 'session_request',
          params: [{
            peerId: '15d8b6a3-15bd-493e-9358-111e3a4e6ee4',
            peerMeta: {
              name: "WalletConnect Example",
              description: "Try out WalletConnect v1.0",
              icons: ["https://example.walletconnect.org/favicon.ico"],
              url: "https://example.walletconnect.org"
            }
          }]
        }
        */
      });
    }
  }, [connector]);

  

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
