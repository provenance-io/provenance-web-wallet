import styled from 'styled-components';
import { useState } from 'react';
import { CopyValue, CtaButton, Header, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';
import { useWallet } from 'redux/hooks';

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
const WalletName = styled.div`
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
  const { activeWalletIndex, wallets, setActiveWalletIndex } = useWallet();
  const [ walletMenuTarget, setWalletMenuTarget ] = useState(-1);

  const renderWallets = () => wallets.map(({ address, walletName }, index) => (
    <WalletItem key={address} active={index === activeWalletIndex} onClick={() => { setWalletMenuTarget(index)} }>
      <WalletText>
        <WalletName>{walletName}</WalletName>
      </WalletText>
      <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
    </WalletItem>
  ));

  return (
    <>
      <Header title='Wallets' iconLeft={ICON_NAMES.CLOSE} backLocation={DASHBOARD_URL} />
      {renderWallets()}
      {walletMenuTarget > -1 && (
        <WalletActionsPopup onClick={() => setWalletMenuTarget(-1)}>
          {activeWalletIndex !== walletMenuTarget && (
            <WalletAction onClick={() => setActiveWalletIndex(walletMenuTarget)}>
              Select Wallet
            </WalletAction>
          )}
          {/* TODO: User must click on text to copy, instead have user click on entire button row */}
          <WalletAction>
            <CopyValue value={wallets[walletMenuTarget]?.address} successText="Address Copied!" noPopup>Copy Wallet Address</CopyValue>
          </WalletAction>
          <WalletAction>Rename</WalletAction>
          <WalletAction>Remove</WalletAction>
          <WalletAction onClick={() => setWalletMenuTarget(-1)}>Close</WalletAction>
        </WalletActionsPopup>
      )}
      <CtaButton onClick={() => navigate('../create')}>Create Account</CtaButton>
    </>
  );
};
