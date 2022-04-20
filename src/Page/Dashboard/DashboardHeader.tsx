import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import { COLORS } from 'theme';
import { useWallet } from 'redux/hooks';
import { trimString } from 'utils';

const HeaderRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
const Menu = styled.div`
  cursor: pointer;
`;
const WalletInfo = styled.div`
  font-size: 1.4rem;
  line-height: 3px;
  text-align: left;
`;
const WalletName = styled.p`
  font-weight: 700;
`;
const WalletAddress = styled.p`
  font-weight: 400;
`;
const WalletConnect = styled.div`
  cursor: pointer;
`;
const Notify = styled.span`
  position: absolute;
  border-radius: 50%;
  background-color: ${COLORS.SECONDARY_650};
  color: ${COLORS.SECONDARY_250};
  height: 20px;
  width: 20px;
  font-family: 'Gothic A1', sans-serif;
  margin-left: -15px;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  padding: 4px 0 0 1px;
`;

export const DashboardHeader:React.FC = () => {
  const navigate = useNavigate();
  const { activeWalletIndex, wallets } = useWallet();
  const activeWallet = wallets[activeWalletIndex];
  const { walletName, address = '' } = activeWallet;

  // TODO: Add check for wallet connected here
  const connected = true;
  // TODO: Add check for pending notifications here
  const notify = true;
  // TODO: Add check for number of notifications here
  const notifications = 3;
  // TODO: Need to navigate to the correct connection details
  const handleConnect = () => navigate('/connect-details');
  // TODO: Add onClick for QR Code click

  return (
    <HeaderRow>
      <Menu onClick={() => navigate('./menu')}>
        <Sprite icon={ICON_NAMES.MENU} size="2rem" />
      </Menu>
      <WalletInfo>
        <WalletName>{walletName}</WalletName>
        <WalletAddress>({trimString(address, 11, 4)})</WalletAddress>
      </WalletInfo>
      <WalletConnect>
        {connected ? (
          <>
            <Sprite onClick={handleConnect} icon={ICON_NAMES.CHAIN} size="4.8rem" spin="90"/>
            {notify && <Notify>{notifications}</Notify>}
          </>
        ) : (
          <Sprite icon={ICON_NAMES.QRCODE} size="4.8rem"/>
        )}
      </WalletConnect>
    </HeaderRow>
  );
};
