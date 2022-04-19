import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useWallet } from 'redux/hooks';

const Wrapper = styled.div`
  padding: 42px 16px;
`;

interface Props {
  nextUrl: string;
}

export const CreateStart = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { wallets, updateWallet, createWallet, setActiveWalletIndex } = useWallet();
  const totalWallets = wallets.length;
  const [walletName, setWalletName] = useState('');

  const handleContinue = () => {
    if (walletName) {
      if (totalWallets) {
        // Additional wallet
        const newWallet = { walletName, walletIndex: totalWallets };
        updateWallet(newWallet);
      } else {
        // No existing wallets
        createWallet({ walletName });
      }
      // Set active wallet to this new created wallet
      setActiveWalletIndex(totalWallets);
      // Move to next step
      navigate(nextUrl);
    }
  };

  return (
    <Wrapper>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Name Your Account" backLocation='/' />
      <BodyContent
        $css={css`
          text-align: center;
          margin-bottom: 32px;
        `}
      >
        Name your acount to easily identify it while using the Figure Tech Wallet. These names are
        stored locally, and can only be seen by you.
      </BodyContent>

      <Input id="account-name" label="Account Name" type="text" placeholder="Account Name" value={walletName} onChange={setWalletName} />
      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </Wrapper>
  );
};
