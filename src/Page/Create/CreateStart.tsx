import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'redux/store';
import styled, { css } from 'styled-components';
import { walletActions } from 'redux/features/wallet/walletSlice';

const Wrapper = styled.div`
  padding: 42px 16px;
`;

interface Props {
  nextUrl: string;
}

export const CreateStart = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { wallets } = useSelector((state: RootState) => state.wallet);
  const totalWallets = wallets.length;
  const { updateWallet, createWallet, setActiveWalletIndex } = walletActions;
  const dispatch = useDispatch();
  const [walletName, setWalletName] = useState('');

  const handleContinue = () => {
    if (walletName) {
      if (totalWallets) {
        // Additional wallet
        const newWallet = { walletName, walletIndex: totalWallets };
        dispatch(updateWallet(newWallet));
      } else {
        // No existing wallets
        dispatch(createWallet({ walletName }));
      }
      // Set active wallet to this new created wallet
      dispatch(setActiveWalletIndex(totalWallets));
      // Move to next step
      navigate(nextUrl);
    }
  };

  return (
    <Wrapper>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Name You Account" />
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
