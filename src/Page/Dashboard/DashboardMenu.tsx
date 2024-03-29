import styled, { css } from 'styled-components';
import { useState } from 'react';
import {
  CopyValue,
  Button,
  Header,
  Sprite,
  BottomFloat,
  ButtonGroup,
  Typo,
  PillInline,
  Content,
  ScrollContainer,
} from 'Components';
import { useNavigate } from 'react-router-dom';
import {
  DASHBOARD_URL,
  ICON_NAMES,
  MAINNET_NETWORK,
  NEW_ACCOUNT_ADD_URL,
  NEW_ACCOUNT_SUB_URL,
  NEW_ACCOUNT_IMPORT_URL,
  REMOVE_ACCOUNT_URL,
  RENAME_ACCOUNT_URL,
} from 'consts';
import { useAccount, useWalletConnect } from 'redux/hooks';
import { keyPress, openTab, trimAddress } from 'utils';
import { COLORS } from 'theme';

const WalletItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${({ active }) =>
    active ? COLORS.SECONDARY_650 : COLORS.NEUTRAL_700};
  margin-bottom: 2px;
  padding: 16px 24px;
  transition: 250ms all;
  cursor: pointer;
  &:hover {
    background: ${({ active }) =>
      active ? COLORS.SECONDARY_550 : COLORS.NEUTRAL_600};
  }
`;
const WalletInfo = styled.div`
  display: flex;
  font-family: 'Gothic A1', sans-serif;
  line-height: 2.2rem;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
`;
const WalletText = styled.div``;
const AccountName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.4rem;
`;
const AccountAddress = styled.div`
  font-size: 1.2rem;
  color: ${COLORS.NEUTRAL_250};
  line-height: 1.2rem;
`;
const WalletSubMenuIcon = styled.div`
  margin-left: 20px;
  svg {
    transition: 500ms all;
  }
  &:hover {
    svg {
      transform: rotate(90deg);
    }
  }
`;
const WalletActionsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: ${COLORS.BLACK_40};
  height: 100%;
  width: inherit;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;
const WalletActionMixin = css`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  padding: 24px 16px;
  background: ${COLORS.NEUTRAL_700};
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 2px solid ${COLORS.NEUTRAL_600};
  cursor: pointer;
  transition: 250ms all;
  height: auto;
  &:hover {
    background: ${COLORS.NEUTRAL_600};
  }
  &:last-of-type {
    border-bottom: none;
  }
`;
const WalletAction = styled.div`
  ${WalletActionMixin}
`;
const WalletCopy = styled(CopyValue)`
  ${WalletActionMixin}
  width: 100%;
  height: auto;
`;

export const DashboardMenu: React.FC = () => {
  const navigate = useNavigate();
  const { activeAccountId, accounts, setActiveAccount } = useAccount();
  const { connector } = useWalletConnect();
  const [accountMenuTargetId, setAccountMenuTargetId] = useState('');
  const menuTargetAccount = accountMenuTargetId
    ? accounts.find((account) => account.address === accountMenuTargetId)
    : { address: '', accountLevel: '' };
  const { address: menuTargetAddress, accountLevel: menuTargetAccountLevel } =
    menuTargetAccount!;

  const handleSelectAccount = async (address: string) => {
    // If this wallet isn't already active, make it active
    if (activeAccountId !== address) {
      // If we are connected to a dApp and the user changes accounts, disconnect from dApp
      if (connector) connector.killSession();
      // Save to redux and chrome storage
      await setActiveAccount(address);
      // Navigate back to the dashboard
      navigate(DASHBOARD_URL);
    }
  };
  const changeAccountSubmenu = (
    event: React.KeyboardEvent | React.MouseEvent,
    address: string
  ) => {
    // Prevent event from floating up
    event.stopPropagation();
    setAccountMenuTargetId(address);
  };

  const renderWallets = () =>
    accounts.map(({ address, name, network }) => (
      <WalletItem
        key={address}
        active={address === activeAccountId}
        tabIndex={0}
        onClick={() => handleSelectAccount(address!)}
        onKeyPress={(e) => keyPress(e, () => handleSelectAccount(address!))}
      >
        <WalletInfo>
          <WalletText>
            <AccountName>{name}</AccountName>
            <AccountAddress>{trimAddress(address!)}</AccountAddress>
          </WalletText>
          <PillInline
            title={network!}
            type={network === MAINNET_NETWORK ? 'primary' : 'secondary'}
            active={address === activeAccountId}
          />
        </WalletInfo>
        <WalletSubMenuIcon
          tabIndex={0}
          onClick={(e) => {
            changeAccountSubmenu(e, address!);
          }}
          onKeyPress={(e) => {
            keyPress(e, () => setAccountMenuTargetId(address!));
          }}
        >
          <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
        </WalletSubMenuIcon>
      </WalletItem>
    ));

  return (
    <Content>
      <Header
        title="Accounts"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={DASHBOARD_URL}
      />
      <Typo type="footnote" italic marginBottom="12px">
        Clicking an account name will set it as active
      </Typo>
      <ScrollContainer height="360px" paddingBottom="0px">
        {renderWallets()}
      </ScrollContainer>
      {accountMenuTargetId && (
        <WalletActionsPopup onClick={() => setAccountMenuTargetId('')}>
          <WalletCopy
            value={menuTargetAddress}
            successText="Address Copied!"
            noPopup
          >
            Copy Account Address
          </WalletCopy>
          {menuTargetAccountLevel !== 'addressIndex' && (
            <WalletAction
              onClick={() => openTab(NEW_ACCOUNT_SUB_URL)}
              tabIndex={0}
              onKeyPress={(e) => keyPress(e, () => openTab(NEW_ACCOUNT_IMPORT_URL))}
            >
              Create Sub Account
            </WalletAction>
          )}
          <WalletAction
            onClick={() => navigate(`${RENAME_ACCOUNT_URL}/${menuTargetAddress}`)}
            tabIndex={0}
            onKeyPress={(e) =>
              keyPress(e, () =>
                navigate(`${RENAME_ACCOUNT_URL}/${menuTargetAddress}`)
              )
            }
          >
            Rename
          </WalletAction>
          {accounts.length > 1 && (
            <WalletAction
              onClick={() => navigate(`${REMOVE_ACCOUNT_URL}/${menuTargetAddress}`)}
              tabIndex={0}
              onKeyPress={(e) =>
                keyPress(e, () =>
                  navigate(`${REMOVE_ACCOUNT_URL}/${menuTargetAddress}`)
                )
              }
            >
              Remove
            </WalletAction>
          )}
          <WalletAction
            onClick={() => setAccountMenuTargetId('')}
            tabIndex={0}
            onKeyPress={(e) => keyPress(e, () => setAccountMenuTargetId(''))}
          >
            Close
          </WalletAction>
        </WalletActionsPopup>
      )}
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={() => openTab(NEW_ACCOUNT_ADD_URL)}>
            Create New Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => openTab(NEW_ACCOUNT_IMPORT_URL)}
          >
            Import Account
          </Button>
        </ButtonGroup>
      </BottomFloat>
    </Content>
  );
};
