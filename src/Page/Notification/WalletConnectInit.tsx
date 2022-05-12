import { useState } from 'react';
import styled from 'styled-components';
import { Sprite } from 'Components';
import { trimString, removePendingRequest } from 'utils';
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
  max-width: 200px;
  margin: 50px auto 20px auto;
`;
const SubTitle = styled.div`
  font-weight: 400;
  font-family: "Gothic A1", sans-serif;
  letter-spacing: 0.04em;
  line-height: 160%;
  text-align: center;
  font-size: 1.4rem;
  max-width: 200px;
  margin: auto;
`;
const UrlText = styled.div`
  font-size: 1.2rem;
  font-style: italic;
  color: #DDDDDD;
`;
const ConnectIcon = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 40px;
  height: 80px;
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
  payload: EventPayload,
  closeWindow: () => void,
}

export const WalletConnectInit:React.FC<Props> = ({ payload, closeWindow }) => {
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);
  const { peerMeta = {
    name: 'N/A',
    url: 'N/A',
    icons: [],
  } } = payload?.params[0];
  const { name, url, icons } = peerMeta;
  const { accounts, activeAccountIndex } = useAccount();
  const { connector } = useWalletConnect();
  const activeAccount = accounts[activeAccountIndex];

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
    else {
      // No connector, this session is long gone, just kill it
      const pendingId = `${payload.date}_${payload.id}`;
      await removePendingRequest(pendingId);
      // Close the popup
      closeWindow();
    }
  }

  return (
    <>
      <Title>Connection Request</Title>
      <SubTitle>
        Allow connection to {trimString(name, 120)}?
        <UrlText>({url})</UrlText>
      </SubTitle>
      <ConnectIcon>
        {(icons?.length && !useFallbackIcon) ? (
          <ConnectPeerImg src={icons[0]} onError={() => setUseFallbackIcon(true)} alt="Peer Icon" />
        ) : <Sprite icon={ICON_NAMES.CHAIN} size="6rem" />}
        <ConnectBgImg src={circleIcon} />
      </ConnectIcon>
      <Authenticate handleApprove={handleApprove} handleDecline={handleDecline} />
    </>
  );
};