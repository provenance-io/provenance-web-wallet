import {
  ACTIONS_URL,
  DASHBOARD_URL,
  ICON_NAMES,
  PROFILE_URL,
  TRANSACTIONS_URL,
} from 'consts';
import { Sprite } from 'Components';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWalletConnect } from 'redux/hooks';
import { keyPress } from 'utils';

const Footer = styled.footer`
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 0;
  left: 0;
  background: black;
  height: 80px;
  width: 100%;
  max-width: 100%;
  padding: 20px;
  z-index: 100;
  box-sizing: border-box;
  justify-content: space-between;
  width: inherit;
`;
const NavItem = styled.div<{ active?: boolean }>`
  font-size: 1.2rem;
  font-weight: 400;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  svg {
    color: ${({ active }) => (active ? '#FFFFFF' : '#464B5D')};
    margin-bottom: 10px;
  }
`;
const Notification = styled.div`
  position: absolute;
  height: 16px;
  width: 16px;
  background: red;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  z-index: 10;
  border-radius: 100%;
  top: 0;
  right: 20px;
`;

export const FooterNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPendingRequests } = useWalletConnect();

  return (
    <Footer>
      <NavItem
        active={location?.pathname?.includes('dashboard')}
        onClick={() => navigate(DASHBOARD_URL)}
        onKeyPress={(e) => keyPress(e, 'Enter', () => navigate(DASHBOARD_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.DASHBOARD} size="1.6rem" />
        Dashboard
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('actions')}
        onClick={() => navigate(ACTIONS_URL)}
        onKeyPress={(e) => keyPress(e, 'Enter', () => navigate(ACTIONS_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.CUBES} size="1.6rem" />
        {!!totalPendingRequests && (
          <Notification>{totalPendingRequests}</Notification>
        )}
        Actions
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('transactions')}
        onClick={() => navigate(TRANSACTIONS_URL)}
        onKeyPress={(e) => keyPress(e, 'Enter', () => navigate(TRANSACTIONS_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.TRANSACTIONS} size="1.6rem" />
        Txs
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('profile')}
        onClick={() => navigate(PROFILE_URL)}
        onKeyPress={(e) => keyPress(e, 'Enter', () => navigate(PROFILE_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.PROFILE} size="1.6rem" />
        Profile
      </NavItem>
    </Footer>
  );
};
