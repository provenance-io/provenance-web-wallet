import styled from 'styled-components';
import {
  ICON_NAMES,
  DASHBOARD_CONNECTION_DETAILS_URL,
  DASHBOARD_MENU_URL,
  ACTIONS_URL,
} from 'consts';
import { Sprite, CopyValue, Typo, PillInline as PillInlineBase } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useWalletConnect } from 'redux/hooks';
import { keyPress, trimAddress } from 'utils';
import { COLORS, FONTS } from 'theme';

const HeaderRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
const Menu = styled.div`
  cursor: pointer;
  margin-right: 16px;
  svg {
    transition: 500ms all;
  }
  &:hover {
    svg {
      transform: rotate(90deg);
    }
  }
`;
const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const WalletInfo = styled.div`
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;
const PillInline = styled(PillInlineBase)`
  margin-left: 20px;
`;
const IconContainer = styled.div`
  cursor: pointer;
  position: relative;
  &:last-child {
    margin-left: 16px;
  }
`;
const NotificationBubble = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  ${FONTS.PRIMARY_FONT};
  background: ${COLORS.NEGATIVE_300};
  color: ${COLORS.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.02rem;
  z-index: 10;
  border-radius: 100%;
  top: 0;
  left: 16px;
`;

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { session, connector, totalPendingRequests } = useWalletConnect();
  const { connected } = session;
  const activeAccount = useActiveAccount();
  const { name, address = '', network } = activeAccount;
  const viewConnection = () => navigate(DASHBOARD_CONNECTION_DETAILS_URL);
  const viewNotifications = () => navigate(ACTIONS_URL);

  return (
    <HeaderRow>
      <Menu onClick={() => navigate(DASHBOARD_MENU_URL)}>
        <Sprite icon={ICON_NAMES.MENU} height="2rem" width="1rem" />
      </Menu>
      <WalletInfo>
        <CopyValue value={address} title="Copy account address">
          <Typo type="footnote" color="WHITE" align="left" bold>
            {name}
          </Typo>
          <Typo type="footnote" color="WHITE" align="left">
            {trimAddress(address)}
          </Typo>
        </CopyValue>
        {network === 'testnet' && (
          <PillInline title="testnet" type="tertiary" active />
        )}
      </WalletInfo>
      <RightSection>
        {!!connected && !!connector && (
          <IconContainer
            onClick={viewConnection}
            onKeyPress={(e) => keyPress(e, viewConnection)}
            tabIndex={0}
            title="Connected to dApp"
          >
            <Sprite
              icon={ICON_NAMES.CHAIN}
              size="3.1rem"
              color={COLORS.SECONDARY_300}
            />
          </IconContainer>
        )}
        <IconContainer
          onClick={viewNotifications}
          onKeyPress={(e) => keyPress(e, viewNotifications)}
          tabIndex={0}
          title="Notifications"
        >
          <Sprite icon={ICON_NAMES.NOTIFICATION} size="3.1rem" />
          {!!totalPendingRequests && (
            <NotificationBubble>{totalPendingRequests}</NotificationBubble>
          )}
        </IconContainer>
      </RightSection>
    </HeaderRow>
  );
};
