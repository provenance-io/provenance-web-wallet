import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useWallet } from 'redux/hooks';
import { encrypt, addToLocalStorage } from 'utils';

const Wrapper = styled.div`
  padding: 42px 16px;
  input {
    margin-bottom: 10px;
  }
`;
const Error = styled.div`
  color: #ED6E74;
  margin-top: 20px;
  font-size: 1.3rem;
`;

interface Props {
  nextUrl: string;
}

export const CreatePassword = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { wallets, activeWalletIndex } = useWallet();
  const targetWallet = wallets[activeWalletIndex];
  const { privateKey, accountName } = targetWallet;
  const [walletPassword, setWalletPassword] = useState('');
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    let latestError = '';
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < 5) latestError = 'Password must be a minimum of 5 characters.';
    if (!latestError) {
      if (privateKey) {    
        const encrypted = encrypt(privateKey, walletPassword);
        const data = { accountName, key: encrypted };
        addToLocalStorage('provenance-web-wallet', data);
        navigate(nextUrl);
      } else {
        latestError = 'Unable to locally save wallet, please try again later'
      }
    }
    setError(latestError);
  };

  return (
    <Wrapper>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Account Password" backLocation='/' />
      <BodyContent
        $css={css`
          text-align: center;
          margin-bottom: 32px;
        `}
      >
        Enter an account password.  This password will be used to connect to this wallet, it is only stored locally to decrypt the created wallet.
      </BodyContent>

      <Input
        id="account-password"
        label="Account Password"
        type="text"
        placeholder="Account Password"
        value={walletPassword}
        onChange={setWalletPassword}
      />
      <Input
        id="account-password-repeat"
        label="Confirm Account Password"
        type="text"
        placeholder="Confirm Account Password"
        value={walletPasswordRepeat}
        onChange={setWalletPasswordRepeat}
      />
      {error && <Error>{error}</Error>}
      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </Wrapper>
  );
};