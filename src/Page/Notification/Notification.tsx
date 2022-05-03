import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Sprite, Content, ButtonGroup } from 'Components';
import { ICON_NAMES, CHAINID_TESTNET } from 'consts';
import { useEffect, useState } from 'react';
import { useWalletConnect, useAccount } from 'redux/hooks';
import circleIcon from 'images/circle-icon.svg';
import { trimString } from 'utils';

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
const DisplayTitle = styled.div`
  font-family: "Courier New", Courier, monospace;
  color: white;
  font-weight: bold;
  background: rgba(255,255,255,0.5);
  box-shadow: 0px 0px 9px 0px rgb(255 255 255 / 70%) inset;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 1.6rem;
  margin: 30px;
  white-space: nowrap;
  overflow: scroll;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
const SubTitle = styled.div`
  font-weight: 400;
  font-family: "Gothic A1", sans-serif;
  letter-spacing: 0.04em;
  line-height: 160%;
  text-align: center;
  font-size: 1.6rem;
  margin: 32px;
`;
const Warning = styled.div`
  font-size: 1.2rem;
  color: #a85858;
  font-style: italic;
`;
const ConnectIcon = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 50px 0 80px 0;
`;
const ConnectPeerImg = styled.img`
  z-index: 1;
  height: 40px;
  width: 40px;
`;
const ConnectBgImg = styled.img`
  position: absolute;
  height: 80px;
  width: 80px;
`;

interface PeerMeta {
  description?: string,
  icons?: string[],
  name?: string,
  url?: string,
}

export const Notification:React.FC = () => {
  const [peerData, setPeerData] = useState<PeerMeta>({});
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createConnector, connector } = useWalletConnect();
  const { accounts, activeAccountIndex } = useAccount();
  const activeAccount = accounts[activeAccountIndex];
  const walletConnectUriParam = searchParams.get('wc');

  // On load, create the walletConnect event listeners
  useEffect(() => {
    if (connector) {
      connector.on('session_request', (error, payload) => {
        const { peerMeta = {} } = payload?.params[0];
        setPeerData(peerMeta);
        console.log('peerMeta: ', peerMeta);
        console.log('SESSION_REQUEST EVENT: ', payload, error);
      });
      connector.on('connect', (error, payload) => {
        console.log('CONNECT EVENT: ', payload, error);
      });
      connector.on('disconnect', (error, payload) => {
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

  const closeWindow = async () => {
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.id) {
      chrome.windows.remove(currentWindow.id);
    } else {
      window.close();
    }
  };

  const handleApprove = async () => {
    if (connector) {
      const data = {
        chainId: CHAINID_TESTNET,
        accounts: [{
          publicKey: activeAccount.publicKey,
          address: activeAccount.address,
          jwt: `${btoa('123')}.${btoa('456')}.${btoa('789')}`,
          walletInfo: {
            id: 'id',
            name: activeAccount.name,
            coin: 'coin'
          }
        }],
      };
      await connector.approveSession(data as any);
      // Close the popup
      closeWindow();
    }
  }

  const handleDecline = async () => {
    if (connector) {
      await connector.rejectSession({ message: 'Connection rejected by user' });
      // Close the popup
      closeWindow();
    }
  }

  return (
    <Content>
      <Title>Connection Request</Title>
      {peerData?.name && <DisplayTitle>{trimString(peerData.name, 20)}</DisplayTitle>}
      {peerData?.url && (
        <SubTitle>
          Allow connection to {peerData.url}?
        </SubTitle>
      )}
      <ConnectIcon>
        {(peerData?.icons?.length && !useFallbackIcon) ? (
          <ConnectPeerImg src={peerData.icons[0]} onError={() => setUseFallbackIcon(true)} alt="Peer Icon" />
        ) : <Sprite icon={ICON_NAMES.CHAIN} size="6rem" />}
        <ConnectBgImg src={circleIcon} />
      </ConnectIcon>
      <Warning>
        Be careful about which Dapps you connect to, and what permissions you give them. Certain types of transaction require granting a Dapp permission to access your funds
      </Warning>
      <ButtonGroup>
        <Button layout="default" onClick={handleApprove}>Approve</Button>
        <Button layout="default" variant='transparent' onClick={handleDecline}>Reject</Button>
      </ButtonGroup>
    </Content>
  );
};