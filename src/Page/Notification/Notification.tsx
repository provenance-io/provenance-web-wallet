import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Sprite, Content, ButtonGroup } from 'Components';
import { DASHBOARD_URL, ICON_NAMES, CHAINID_TESTNET } from 'consts';
import { useEffect } from 'react';
import { useWalletConnect, useWallet } from 'redux/hooks';

const Title = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.32em;
  line-height: 20px;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
`;
const SubTitle = styled.div`
  font-weight: 400;
  font-family: 'Gothic A1', sans-serif;
  letter-spacing: 0.04em;
  font-size: 1.4rem;
  line-height: 160%;
`;

export const Notification:React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createConnector, connector, setConnected, setConnectionDetails } = useWalletConnect();
  const { wallets, activeWalletIndex } = useWallet();
  const activeWallet = wallets[activeWalletIndex];
  const walletConnectUriParam = searchParams.get('wc');
  console.log('walletConnectUriParam :', walletConnectUriParam);

  // On load, create the walletConnect event listeners
  useEffect(() => {
    if (connector) {
      connector.on('session_request', (error, payload) => {
        console.log('SESSION_REQUEST EVENT: ', payload, error);
      });
      connector.on('connect', (error, payload) => {
        console.log('CONNECT EVENT: ', payload, error);
        setConnectionDetails(payload.params[0]);
        setConnected(true);
      });
      connector.on('disconnect', (error, payload) => {
        setConnected(false);
        console.log('DISCONNECT EVENT: ', payload, error);
      });

      return () => {
        connector.off('session_request');
        connector.off('connect');
        connector.off('disconnect');
      }
    }
  }, [
    connector,
    navigate,
    setConnected,
    setConnectionDetails,
  ]);

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && walletConnectUriParam) {
      // Create new connector
      createConnector(walletConnectUriParam);
      // Clear out uri from search params
      setSearchParams('');
    }
  }, [connector, walletConnectUriParam, createConnector, setSearchParams]);

  const handleApprove = () => {
    console.log('handleApprove()');
    if (connector) {
      console.log('activeWallet :', activeWallet);
      console.log('wallets :', wallets);
      console.log('activeWalletIndex :', activeWalletIndex);
      const data = {
        chainId: CHAINID_TESTNET,
        accounts: [{
          publicKey: activeWallet.publicKey,
          address: activeWallet.address,
          jwt: `${btoa('123')}.${btoa('456')}.${btoa('789')}`,
          walletInfo: {
            id: 'id',
            name: activeWallet.walletName,
            coin: 'coin'
          }
        }],
      };
      connector.approveSession(data as any);
    }
  }

  const handleDecline = () => {
    if (connector) {
      connector.rejectSession({ message: 'Connection rejected by user' });
      // Wait 1 second then close this Notification popup
      setTimeout(() => {
        window.close();
      }, 1000);
    }
    navigate(DASHBOARD_URL);
  }

  return (
    <Content>
      <Title>Connection Request</Title>
      <SubTitle>
        Allow connection to localhost:3000?
      </SubTitle>
      <Sprite icon={ICON_NAMES.CHECK} />
      <ButtonGroup>
        <Button layout="default" onClick={handleApprove}>Approve</Button>
        <Button layout="default" variant='transparent' onClick={handleDecline}>Reject</Button>
      </ButtonGroup>
    </Content>
  );
};