import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useWallet } from 'redux/hooks';
import {
  encrypt,
  createMasterKeyFromMnemonic,
  bytesToBase64,
  createWalletFromMasterKey,
  saveKey,
} from 'utils';

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
  const { tempWallet, createWallet: createStoreWallet, setAccountPassword } = useWallet();
  const [walletPassword, setWalletPassword] = useState('');
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    let latestError = '';
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < 5) latestError = 'Password must be a minimum of 5 characters.';
    if (!latestError) {
      if (tempWallet?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempWallet.mnemonic);
        const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        console.log('masterKey: ', masterKey);
        // Save data to redux store and clear out tempWallet data
        const newWalletData = {
          address,
          publicKey: b64PublicKey,
          privateKey: b64PrivateKey,
          walletName: tempWallet.walletName,
        };
        createStoreWallet(newWalletData);
        // Encrypt data with provided password
        const encrypted = encrypt(masterKey.toBase58(), walletPassword);
        // Add data to localStorage
        saveKey(encrypted);
        // Save password for creating additional accounts (all same password)
        setAccountPassword(btoa(walletPassword));
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
        type="password"
        placeholder="Account Password"
        value={walletPassword}
        onChange={setWalletPassword}
      />
      <Input
        id="account-password-repeat"
        label="Confirm Account Password"
        type="password"
        placeholder="Confirm Account Password"
        value={walletPasswordRepeat}
        onChange={setWalletPasswordRepeat}
      />
      {error && <Error>{error}</Error>}
      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </Wrapper>
  );
};
