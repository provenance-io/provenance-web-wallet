import { useState } from 'react';
import styled from 'styled-components';
import { Sprite } from 'Components';
import { trimString } from 'utils';
import { ICON_NAMES, CHAINID_TESTNET } from 'consts';
import circleIcon from 'images/circle-icon.svg';
import { useAccount, useWalletConnect } from 'redux/hooks';
import { EventPayload } from 'types';
import { Authenticate } from './Authenticate';

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

interface Props {
  data: EventPayload
}

export const WalletConnectInit:React.FC<Props> = ({ data }) => {
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);
  const { peerMeta = {
    name: 'N/A',
    url: 'N/A',
    icons: [],
  } } = data?.payload?.params[0];
  const { name, url, icons } = peerMeta;
  const { accounts, activeAccountIndex } = useAccount();
  const { connector } = useWalletConnect();
  const activeAccount = accounts[activeAccountIndex];

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
        // TODO: This needs to be based on the selected account(s)
        // NOTE: Don't allow selecting both testnet and mainnet accounts at the same time
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
    <>
      <Title>Connection Request</Title>
      <DisplayTitle>{trimString(name, 20)}</DisplayTitle>
      <SubTitle>
        Allow connection to {url}?
      </SubTitle>
      <ConnectIcon>
        {(icons?.length && !useFallbackIcon) ? (
          <ConnectPeerImg src={icons[0]} onError={() => setUseFallbackIcon(true)} alt="Peer Icon" />
        ) : <Sprite icon={ICON_NAMES.CHAIN} size="6rem" />}
        <ConnectBgImg src={circleIcon} />
      </ConnectIcon>
      <Warning>
        Be careful about which Dapps you connect to, and what permissions you give them. Certain types of transaction require granting a Dapp permission to access your funds
      </Warning>
      <Authenticate handleApprove={handleApprove} handleDecline={handleDecline} />
    </>
  );
};