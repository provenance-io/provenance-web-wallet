import styled from 'styled-components';
import { useState } from 'react';
import { CopyValue, Button, Header, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';
import { useAccount } from 'redux/hooks';
import { addSavedData } from 'utils';

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
const WalletText = styled.div`
  font-family: 'Gothic A1', sans-serif;
  line-height: 2.2rem;
`;
const AccountName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
`;
const WalletActionsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
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

export const DashboardMenu:React.FC = () => {
  const navigate = useNavigate();
  const { activeAccountId, accounts, setActiveAccountId } = useAccount();
  const [ accountMenuTargetId, setAccountMenuTargetId ] = useState(-1);

  const renderWallets = () => accounts.map(({ address, name, id }) => (
    <WalletItem key={address} active={id === activeAccountId} onClick={() => { setAccountMenuTargetId(id!)} }>
      <WalletText>
        <AccountName>{name}</AccountName>
      </WalletText>
      <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
    </WalletItem>
  ));

  const handleSelectWallet = async () => {
    await addSavedData({ activeAccountId: accountMenuTargetId }); // Save browser
    setActiveAccountId(accountMenuTargetId); // Save redux store
  };

  return (
    <>
      <Header title='Wallets' iconLeft={ICON_NAMES.CLOSE} backLocation={DASHBOARD_URL} />
      {renderWallets()}
      {accountMenuTargetId > -1 && (
        <WalletActionsPopup onClick={() => setAccountMenuTargetId(-1)}>
          {activeAccountId !== accountMenuTargetId && (
            <WalletAction onClick={handleSelectWallet}>
              Select Account
            </WalletAction>
          )}
          {/* TODO: User must click on text to copy, instead have user click on entire button row */}
          <WalletAction>
            <CopyValue value={accounts[accountMenuTargetId]?.address} successText="Address Copied!" noPopup>Copy Account Address</CopyValue>
          </WalletAction>
          <WalletAction>Rename</WalletAction>
          <WalletAction>Remove</WalletAction>
          <WalletAction onClick={() => setAccountMenuTargetId(-1)}>Close</WalletAction>
        </WalletActionsPopup>
      )}
      <Button onClick={() => navigate('../create')} >Create Account</Button>
    </>
  );
};
