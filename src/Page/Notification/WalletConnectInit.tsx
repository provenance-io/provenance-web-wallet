import { useState } from 'react';
import styled from 'styled-components';
import { Sprite, Authenticate, Typo, Content, RowItem } from 'Components';
import { buildJWT, trimAddress, trimString } from 'utils';
import { ICON_NAMES, CHAINID_TESTNET } from 'consts';
import circleIcon from 'images/circle-icon.svg';
import { useActiveAccount, useWalletConnect, useAccount } from 'redux/hooks';
import type { BIP32Interface, WCInitEventPayload } from 'types';
import { COLORS } from 'theme';

const ConnectIcon = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 20px;
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
const SelectedAccountContainer = styled.div``;
const AccountSelectPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  padding: 20px;
  background: ${COLORS.BACKGROUND_1};
`;

interface Props {
  payload: WCInitEventPayload;
  closeWindow: () => void;
}

export const WalletConnectInit: React.FC<Props> = ({ payload, closeWindow }) => {
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);
  const [showSelectAccountMenu, setShowSelectAccountMenu] = useState(false);
  const { name = 'N/A', url = 'N/A', icons = [] } = payload?.params[0].peerMeta;
  const {
    connector,
    saveWalletConnectData,
    connectionDuration,
    connectionReferral,
  } = useWalletConnect();
  const { accounts, setActiveAccount } = useAccount();
  const activeAccount = useActiveAccount();
  const {
    publicKey,
    address: activeAccountAddress,
    name: activeAccountName,
  } = activeAccount;

  const handleApprove = async (masterKey: BIP32Interface) => {
    if (connector) {
      const jwt = buildJWT(masterKey, activeAccountAddress!);
      const data = {
        chainId: CHAINID_TESTNET,
        accounts: [
          {
            publicKey,
            address: activeAccountAddress,
            jwt,
            walletInfo: {
              id: 'id',
              name: activeAccountName,
              coin: 'coin',
            },
          },
        ],
      };
      await connector.approveSession(data as any);
      // Save connection time into storage (settings/walletconnect)
      const now = Date.now();
      await saveWalletConnectData({
        connectionEST: now,
        connectionEXP: now + connectionDuration,
      });
      // If we are successfully connected, update the chrome extension icon
      if (connector?.connected) {
        chrome.action.setIcon(
          {
            path: {
              16: '16_active.png',
              32: '32_active.png',
              48: '48_active.png',
              128: '128_active.png',
            },
          },
          () => {
            // After changing the icon, close the window.
            closeWindow();
          }
        );
      }
    }
  };
  const handleDecline = async () => {
    if (connector) {
      await connector.rejectSession({ message: 'Connection rejected by user' });
      // Close the popup
      closeWindow();
    }
  };

  const renderAccountRows = () =>
    accounts.map(({ address, name }) => (
      <RowItem
        key={address}
        subtitle={trimAddress(address)}
        title={name!}
        onClick={() => {
          setActiveAccount(address!);
          setShowSelectAccountMenu(false);
        }}
      />
    ));

  return (
    <Content>
      {connectionReferral ? (
        <>
          <Typo
            type="headline2"
            marginTop="12px"
            marginBottom="20px"
            maxWidth="300px"
          >
            Extend Connection
          </Typo>
          <Typo type="body" maxWidth="300px">
            Pass connection from
          </Typo>
          <Typo type="subhead" maxWidth="300px">
            {trimString(connectionReferral, 120)} to
          </Typo>
        </>
      ) : (
        <>
          <Typo
            type="headline2"
            marginTop="12px"
            marginBottom="20px"
            maxWidth="300px"
          >
            Connection Request
          </Typo>
          <Typo type="body" maxWidth="300px">
            Allow connection to
          </Typo>
        </>
      )}
      <Typo type="subhead" maxWidth="300px">
        {trimString(name, 120)}?
      </Typo>
      <Typo type="footnote" maxWidth="300px">
        ({url})
      </Typo>
      <ConnectIcon>
        {icons?.length && !useFallbackIcon ? (
          <ConnectPeerImg
            src={icons[0]}
            onError={() => setUseFallbackIcon(true)}
            alt="Peer Icon"
          />
        ) : (
          <Sprite icon={ICON_NAMES.CHAIN} size="6rem" />
        )}
        <ConnectBgImg src={circleIcon} />
      </ConnectIcon>
      <Typo type="subhead" marginTop="20px" marginBottom="10px" align="left">
        Selected Account
      </Typo>
      <SelectedAccountContainer>
        <RowItem
          key={activeAccountAddress}
          subtitle={trimAddress(activeAccountAddress)}
          title={activeAccountName!}
          {...(accounts.length > 1
            ? { onClick: () => setShowSelectAccountMenu(true) }
            : { actionIcon: '' })}
        />
      </SelectedAccountContainer>
      <Authenticate
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        approveText="Connect"
      />
      {showSelectAccountMenu && (
        <AccountSelectPopup>{renderAccountRows()}</AccountSelectPopup>
      )}
    </Content>
  );
};
