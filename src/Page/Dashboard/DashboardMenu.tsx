import styled, { css } from 'styled-components';
import { useState } from 'react';
import {
  CopyValue,
  Button,
  Header,
  Sprite,
  BottomFloat,
  ButtonGroup,
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
import { trimAddress } from 'utils';
import { AccountNetwork } from 'types';
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
`;
const WalletActionsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
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
`;

const Pill = styled.div<{ network: AccountNetwork }>`
  font-size: 1rem;
  ${({ network }) =>
    network === MAINNET_NETWORK
      ? `
    background: ${COLORS.SECONDARY_750};
  `
      : `
    box-shadow: 0 0 0 1px ${COLORS.SECONDARY_500};
    background: none;
  `};
  border-radius: 6px;
  width: 60px;
  text-align: center;
  margin-left: 20px;
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

  const renderWallets = () =>
    accounts.map(({ address, name, network }) => (
      <WalletItem
        key={address}
        active={address === activeAccountId}
        onClick={() => {
          setAccountMenuTargetId(address!);
        }}
      >
        <WalletInfo>
          <WalletText>
            <AccountName>{name}</AccountName>
            <AccountAddress>{trimAddress(address!)}</AccountAddress>
          </WalletText>
          <Pill network={network!}>{network}</Pill>
        </WalletInfo>
        <WalletSubMenuIcon>
          <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
        </WalletSubMenuIcon>
      </WalletItem>
    ));

  const handleSelectAccount = () => {
    // If we are connected to a dApp and the user changes accounts, disconnect from dApp
    if (connector) connector.killSession();
    // Save to redux and chrome storage
    setActiveAccount(accountMenuTargetId);
  };

  return (
    <>
      <Header
        title="Accounts"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={DASHBOARD_URL}
      />
      {renderWallets()}
      {accountMenuTargetId && (
        <WalletActionsPopup onClick={() => setAccountMenuTargetId('')}>
          {activeAccountId !== accountMenuTargetId && (
            <WalletAction onClick={handleSelectAccount}>Select Account</WalletAction>
          )}
          <WalletCopy
            value={menuTargetAddress}
            successText="Address Copied!"
            noPopup
          >
            Copy Account Address
          </WalletCopy>
          {menuTargetAccountLevel !== 'addressIndex' && (
            <WalletAction onClick={() => navigate(NEW_ACCOUNT_SUB_URL)}>
              Create Sub Account
            </WalletAction>
          )}
          <WalletAction
            onClick={() => navigate(`${RENAME_ACCOUNT_URL}/${menuTargetAddress}`)}
          >
            Rename
          </WalletAction>
          {accounts.length > 1 && (
            <WalletAction
              onClick={() => navigate(`${REMOVE_ACCOUNT_URL}/${menuTargetAddress}`)}
            >
              Remove
            </WalletAction>
          )}
          <WalletAction onClick={() => setAccountMenuTargetId('')}>
            Close
          </WalletAction>
        </WalletActionsPopup>
      )}
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={() => navigate(NEW_ACCOUNT_ADD_URL)}>
            Create New Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(NEW_ACCOUNT_IMPORT_URL)}
          >
            Import Account
          </Button>
        </ButtonGroup>
      </BottomFloat>
    </>
  );
};
