import styled from 'styled-components';
import {
  ICON_NAMES,
  DASHBOARD_CONNECTION_DETAILS_URL,
  DASHBOARD_MENU_URL,
} from 'consts';
import { Sprite, CopyValue } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useWalletConnect } from 'redux/hooks';
import { keyPress, trimAddress } from 'utils';

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
  text-align: left;
  flex-grow: 1;
  text-align: 1;
`;
const AccountName = styled.p`
  font-weight: 700;
  margin: 0;
`;
const WalletAddress = styled.p`
  font-weight: 400;
  margin: 0;
`;
const WalletConnect = styled.div`
  cursor: pointer;
`;

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { session, connector } = useWalletConnect();
  const { connected } = session;
  const activeAccount = useActiveAccount();
  const { name, address = '' } = activeAccount;
  const viewNotifications = () => navigate(DASHBOARD_CONNECTION_DETAILS_URL);

  return (
    <HeaderRow>
      <Menu onClick={() => navigate(DASHBOARD_MENU_URL)}>
        <Sprite icon={ICON_NAMES.MENU} size="2rem" />
      </Menu>
      <WalletInfo>
        <CopyValue value={address} title="Copy account address">
          <AccountName>{name}</AccountName>
          <WalletAddress>({trimAddress(address)})</WalletAddress>
        </CopyValue>
      </WalletInfo>
      {!!connected && !!connector && (
        <WalletConnect
          onClick={viewNotifications}
          onKeyPress={(e) => keyPress(e, 'Enter', viewNotifications)}
          tabIndex={0}
        >
          <Sprite icon={ICON_NAMES.CHAIN} size="4.8rem" />
        </WalletConnect>
      )}
    </HeaderRow>
  );
};
