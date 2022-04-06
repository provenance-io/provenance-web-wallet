import styled from 'styled-components';
import { ICON_NAMES } from 'consts';
import { Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';

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

export const DashboardHeader:React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeaderRow>
      <Menu onClick={() => navigate('./menu')}>
        <Sprite icon={ICON_NAMES.MENU} size="2rem" />
      </Menu>
      <WalletInfo>
        <WalletName>My Wallet</WalletName>
        <WalletAddress>(tp1...abcdefg123vzx)</WalletAddress>
      </WalletInfo>
      <WalletConnect>
        <Sprite icon={ICON_NAMES.QRCODE} size="4.8rem" />
      </WalletConnect>
    </HeaderRow>
  );
};
