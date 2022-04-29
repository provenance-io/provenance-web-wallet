import { ICON_NAMES } from 'consts';
import { Sprite } from 'Components';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

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
  padding: 20px 43px;
  z-index: 100;
  box-sizing: border-box;
  justify-content: space-between;
`;
const NavItem = styled.div<{ active?: boolean }>`
  font-size: 1.2rem;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  svg {
    color: ${({ active }) => (active ? '#FFFFFF' : '#464B5D')};
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
        onClick={() => navigate('/dashboard')}
      >
        <Sprite icon={ICON_NAMES.DASHBOARD} size="1.6rem" />
        Dashboard
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('transactions')}
        onClick={() => navigate('/transactions')}
      >
        <Sprite icon={ICON_NAMES.TRANSACTIONS} size="1.6rem" />
        Transactions
      </NavItem>
      <NavItem
        active={location?.pathname?.includes('profile')}
        onClick={() => navigate('/profile')}
      >
        <Sprite icon={ICON_NAMES.PROFILE} size="1.6rem" />
        Profile
      </NavItem>
    </Footer>
  );
};
