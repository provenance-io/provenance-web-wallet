import { DASHBOARD_URL, ICON_NAMES, PROFILE_URL, TRANSACTIONS_URL } from 'consts';
import { Sprite } from 'Components';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { keyPress } from 'utils';
import { COLORS } from 'theme';

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
  padding: 20px 40px;
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
    color: ${({ active }) => (active ? COLORS.WHITE : COLORS.NEUTRAL_550)};
    margin-bottom: 10px;
  }
`;

export const FooterNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Footer>
      <NavItem
        active={location?.pathname?.includes('dashboard')}
        onClick={() => navigate(DASHBOARD_URL)}
        onKeyPress={(e) => keyPress(e, () => navigate(DASHBOARD_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.DASHBOARD} size="1.6rem" />
        Dashboard
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('transactions')}
        onClick={() => navigate(TRANSACTIONS_URL)}
        onKeyPress={(e) => keyPress(e, () => navigate(TRANSACTIONS_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.TRANSACTIONS} size="1.6rem" />
        Transactions
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('profile')}
        onClick={() => navigate(PROFILE_URL)}
        onKeyPress={(e) => keyPress(e, () => navigate(PROFILE_URL))}
        tabIndex={0}
      >
        <Sprite icon={ICON_NAMES.PROFILE} size="1.6rem" />
        Settings
      </NavItem>
    </Footer>
  );
};
