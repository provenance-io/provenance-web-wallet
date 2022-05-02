import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { Sprite, CopyValue } from 'Components';
import { useNavigate } from 'react-router-dom';
import { COLORS } from 'theme';
import { useAccount, useWalletConnect } from 'redux/hooks';
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
  text-align: left;
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
  const { activeAccountIndex, accounts } = useAccount();
  const { connected } = useWalletConnect();
  const activeAccount = accounts[activeAccountIndex];
  const { accountName, address = '' } = activeAccount;

  // TODO: Add check for pending notifications here
  const notify = false;
  // TODO: Add check for number of notifications here
  const notifications = 3;
  // TODO: Need to navigate to the correct connection details
  const viewNotifications = () => navigate('/connect-details');

  return (
    <HeaderRow>
      <Menu onClick={() => navigate('./menu')}>
        <Sprite icon={ICON_NAMES.MENU} size="2rem" />
      </Menu>
        <WalletInfo>
          <CopyValue value={address} title="Copy account address">
            <AccountName>{accountName}</AccountName>
            <WalletAddress>({trimString(address, 11, 4)})</WalletAddress>
          </CopyValue>
        </WalletInfo>
      <WalletConnect>
        {connected && (
          <>
            <Sprite onClick={viewNotifications} icon={ICON_NAMES.CHAIN} size="4.8rem" spin="90"/>
            {notify && <Notify>{notifications}</Notify>}
          </>
        )}
      </WalletConnect>
    </HeaderRow>
  );
};
