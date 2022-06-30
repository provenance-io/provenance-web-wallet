import styled from 'styled-components';
import { useState } from 'react';
import { CopyValue, Button, Header, Sprite, BottomFloat, ButtonGroup } from 'Components';
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
import { useAccount } from 'redux/hooks';
import { trimString } from 'utils';
import { AccountNetwork } from 'types';
import { COLORS } from 'theme';

const WalletItem = styled.div<{active?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${({ active }) => active ? '#01504F' : '#2C2F3A' };
  margin-bottom:2px;
  padding: 16px 24px;
  transition: 250ms all;
  cursor: pointer;
  &:hover {
    background: ${({ active }) => active ? '#12615F' : '#3D3F4B' };
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
  color: #AAAAAA;
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
  width:inherit;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;
const WalletAction = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  padding: 24px 16px;
  background: #2C2F3A;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 2px solid #3D4151;
  cursor: pointer;
  transition: 250ms all;
  &:hover {
    background: #3D3F4B;
  }
  &:last-of-type {
    border-bottom: none;
  }
`;

const Pill = styled.div<{ network: AccountNetwork}>`
  font-size: 1rem;
  ${({ network }) => network === MAINNET_NETWORK ? `
    background: ${COLORS.SECONDARY_750};
  ` : `
    box-shadow: 0 0 0 1px ${COLORS.SECONDARY_500};
    background: none;
  `};
  border-radius: 6px;
  width: 60px;
  text-align: center;
  margin-left: 20px;
`;

export const DashboardMenu:React.FC = () => {
  const navigate = useNavigate();
  const { activeAccountId, accounts, saveAccountData } = useAccount();
  const [ accountMenuTargetId, setAccountMenuTargetId ] = useState('');
  const menuTargetAccount = accountMenuTargetId ? accounts.find(account => account.address === accountMenuTargetId) : { address: '', accountLevel: ''};
  const { address: menuTargetAddress, accountLevel: menuTargetAccountLevel } = menuTargetAccount!;

  const renderWallets = () => accounts.map(({ address, name, network }) => (
    <WalletItem key={address} active={address === activeAccountId} onClick={() => { setAccountMenuTargetId(address!)} }>
      <WalletInfo>
        <WalletText>
          <AccountName>{name}</AccountName>
          <AccountAddress>{trimString(address!, 7, 3)}</AccountAddress>
        </WalletText>
        <Pill network={network!}>{network}</Pill>
      </WalletInfo>
      <WalletSubMenuIcon>
        <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
      </WalletSubMenuIcon>
    </WalletItem>
  ));

  const handleSelectAccount = () => {
    // Save to redux and chrome storage
    saveAccountData({ activeAccountId: accountMenuTargetId })
  };

  return (
    <>
      <Header title='Accounts' iconLeft={ICON_NAMES.CLOSE} backLocation={DASHBOARD_URL} />
      {renderWallets()}
      {accountMenuTargetId && (
        <WalletActionsPopup onClick={() => setAccountMenuTargetId('')}>
          {activeAccountId !== accountMenuTargetId && (
            <WalletAction onClick={handleSelectAccount}>
              Select Account
            </WalletAction>
          )}
          {/* TODO: User must click on text to copy, instead have user click on entire button row */}
          <WalletAction>
            <CopyValue value={menuTargetAddress} successText="Address Copied!" noPopup>Copy Account Address</CopyValue>
          </WalletAction>
          {menuTargetAccountLevel !== 'addressIndex' && (
            <WalletAction onClick={() => navigate(NEW_ACCOUNT_SUB_URL)}>
              Create Sub Account
            </WalletAction>
          )}
          <WalletAction onClick={() => navigate(`${RENAME_ACCOUNT_URL}/${menuTargetAddress}`)}>Rename</WalletAction>
          {accounts.length > 1 && <WalletAction onClick={() => navigate(`${REMOVE_ACCOUNT_URL}/${menuTargetAddress}`)}>Remove</WalletAction>}
          <WalletAction onClick={() => setAccountMenuTargetId('')}>Close</WalletAction>
        </WalletActionsPopup>
      )}
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={() => navigate(NEW_ACCOUNT_ADD_URL)}>Create New Account</Button>
          <Button variant='secondary' onClick={() => navigate(NEW_ACCOUNT_IMPORT_URL)}>Import Account</Button>
        </ButtonGroup>
      </BottomFloat>
    </>
  );
};
