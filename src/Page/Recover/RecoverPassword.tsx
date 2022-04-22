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
  derivationPath,
} from 'utils';

const Wrapper = styled.div`
  padding: 42px 16px;
  padding-bottom: 40px;
  text-align: left;
  max-width: 100%;
  input {
    margin-bottom: 10px;
  }
`;
const Error = styled.div`
  color: #ED6E74;
  margin-top: 20px;
  font-size: 1.3rem;
`;
const AdvancedSection = styled.div`
  padding-bottom: 40px;
`;
const AdvancedTextButton = styled.div`
  color: #357EFD;
  font-weight: bold;
  margin-top: 20px;
  cursor: pointer;
  user-select: none;
`;
const AdvancedTitle = styled.div`
  font-size: 1.5rem;
  margin: 10px 0;
`;
const AdvancedInputArea = styled.div`
  display: flex;
  max-width: 100%;
  font-family: 'Courier New', Courier, monospace;
  align-items: center;
  font-size: 1.6rem;
  color: orange;
  font-weight: bold;
  input {
    width: 60px;
    padding: 0 0 0 10px;
    margin: 0;
  }
`;

interface Props {
  nextUrl: string;
}


interface CustomDerivationPathObject {
  account?: number,
  change?: number,
  addressIndex?: number,
}

export const RecoverPassword = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const {
    tempWallet,
    createWallet: createStoreWallet,
    clearTempWallet,
    setAccountPassword,
  } = useWallet();
  const [walletPassword, setWalletPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customDerivationPath, setCustomDerivationPath] = useState<CustomDerivationPathObject>({});
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const defaultCoinType = process.env.REACT_APP_PROVENANCE_WALLET_COIN_TYPE;
  const { account, change, addressIndex } = customDerivationPath;

  const handleContinue = () => {
    let latestError = '';
    const derivationMissing = (account === undefined || change === undefined || addressIndex === undefined);
    if (showAdvanced && derivationMissing) latestError = 'Missing derivation path value(s).'
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < 5) latestError = 'Password must be a minimum of 5 characters.';
    if (!latestError) {
      if (tempWallet?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempWallet.mnemonic);
        const finalDerivationPath = showAdvanced ? derivationPath({ account, change, address_index: addressIndex }) : undefined;
        const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, undefined, finalDerivationPath);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        // Save data to redux store and clear out tempWallet data
        const newWalletData = {
          address,
          publicKey: b64PublicKey,
          privateKey: b64PrivateKey,
          walletName: tempWallet.walletName,
        };
        createStoreWallet(newWalletData);
        // Encrypt data with provided password
        const encrypted = encrypt(b64PrivateKey, walletPassword);
        // Add data to localStorage
        saveKey(encrypted);
        // Remove tempWallet data
        clearTempWallet();
        // Save password for creating additional accounts (all same password)
        setAccountPassword(walletPassword);
        navigate(nextUrl);
      } else {
        latestError = 'Unable to locally save wallet, please try again later'
      }
    }
    setError(latestError);
  };

  const toggleShowAdvanced = () => {
    if (showAdvanced) {
      setCustomDerivationPath({});
      setShowAdvanced(false);
    }
    else setShowAdvanced(true);
  }

  const changeCustomDerivationPath = (target: keyof CustomDerivationPathObject, value: string) => {
    const newCustomDerivationPath = {...customDerivationPath};
    newCustomDerivationPath[target] = Number(value);
    setCustomDerivationPath(newCustomDerivationPath);
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
      <AdvancedTextButton onClick={toggleShowAdvanced}>Advanced Settings ({showAdvanced ? 'Enabled' : 'Disabled'})</AdvancedTextButton>
      {showAdvanced && (
        <AdvancedSection>
          <AdvancedTitle>HD Derivation Path</AdvancedTitle>
          <AdvancedInputArea>
            m/44'/{defaultCoinType}'/<Input type="number" id="account" value={account !== undefined ? account : ''} onChange={(value) => changeCustomDerivationPath('account', value) } />'/<Input type="number" id="change" value={change !== undefined ? change : ''} onChange={(value) => changeCustomDerivationPath('change', value) } />/<Input type="number" id="addressIndex" value={addressIndex !== undefined ? addressIndex : ''} onChange={(value) => changeCustomDerivationPath('addressIndex', value) } />
          </AdvancedInputArea>
        </AdvancedSection>
      )}
      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </Wrapper>
  );
};
