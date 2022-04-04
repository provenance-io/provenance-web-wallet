import styled from 'styled-components';
import { useState } from 'react';
import { Header, Sprite } from 'Components';
import { ICON_NAMES } from 'consts';

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
const WalletAssets = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
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

interface WalletType {
  address: string,
  name: string,
  assetCount: number,
}

export const DashboardMenu:React.FC = () => {
  // TODO: This should be from storage
  const wallets: WalletType[] = [
    { address: 'tp123', name: 'My Wallet', assetCount: 2 },
    { address: 'tp456', name: 'Backup Wallet', assetCount: 1 },
    { address: 'tp789', name: 'Test Wallet 01', assetCount: 0 },
    { address: 'tp012', name: 'Test Wallet 02', assetCount: 6 },
  ];
  // TODO: Active wallet should come from redux store
  const [ activeWallet, setActiveWallet ] = useState<WalletType>(wallets[0]); 
  const [ walletMenuTarget, setWalletMenuTarget ] = useState('');




  const renderWallets = () => wallets.map(({ address, name, assetCount }, index) => (
    <WalletItem key={address} active={address === activeWallet.address} onClick={() => { setWalletMenuTarget(address)} }>
      <WalletText>
        <WalletName>{name}</WalletName>
        <WalletAssets>{assetCount} Asset{assetCount === 1 ? '' : 's'}</WalletAssets>
      </WalletText>
      <Sprite icon={ICON_NAMES.MENU} size="2.2rem" />
    </WalletItem>
  ));

  return (
    <>
      <Header title='Wallets' iconLeft={ICON_NAMES.CLOSE} />
      {renderWallets()}
      {walletMenuTarget && (
        <WalletActionsPopup onClick={() => setWalletMenuTarget('')}>
          {activeWallet.address !== walletMenuTarget && (
            <WalletAction
              onClick={() => {
                const newActiveWallet = wallets.find((wallet:WalletType) => wallet.address === walletMenuTarget);
                if (newActiveWallet) setActiveWallet(newActiveWallet);
              }}
            >
              Select Wallet
            </WalletAction>
          )}
          <WalletAction>Copy Wallet Address</WalletAction>
          <WalletAction>Recover Wallet</WalletAction>
          <WalletAction>Rename</WalletAction>
          <WalletAction>Remove</WalletAction>
          <WalletAction onClick={() => setWalletMenuTarget('')}>Close</WalletAction>
        </WalletActionsPopup>
      )}
    </>
  );
};
