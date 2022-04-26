import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useWallet, useAddress } from 'redux/hooks';
import { BIP32Interface } from 'bip32';
import {
  encryptKey,
  createMasterKeyFromMnemonic,
  bytesToBase64,
  createWalletFromMasterKey,
  saveKey,
  saveName,
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
  const { getAddressAssetsRaw } = useAddress();
  const {
    tempWallet,
    createWallet: createStoreWallet,
    clearTempWallet,
  } = useWallet();
  const [walletPassword, setWalletPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customDerivationPath, setCustomDerivationPath] = useState<CustomDerivationPathObject>({});
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const defaultCoinType = process.env.REACT_APP_PROVENANCE_WALLET_COIN_TYPE;
  const { account, change, addressIndex } = customDerivationPath;
  const passwordMinLength = Number(process.env.REACT_APP_PASSWORD_MIN_LENGTH)!;
  const defaultAccountName = process.env.REACT_APP_DEFAULT_ACCOUNT_NAME!;

  const recoverAccountLoop = async (masterKey: BIP32Interface, addressIndex: number = 0, defaultWalletName?: string): Promise<string> => {
    const path = derivationPath({ address_index: addressIndex });
    const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey, undefined, path);
    const b64PublicKey = bytesToBase64(publicKey);
    const b64PrivateKey = bytesToBase64(privateKey);
    const walletName = defaultWalletName || `${defaultAccountName}${addressIndex + 1}`;
    // Save data to redux store and clear out tempWallet data
    const newWalletData = {
      address,
      publicKey: b64PublicKey,
      privateKey: b64PrivateKey,
      walletName,
    };
    // Loop up to see if account holds any hash, if it does, add it, if it doesn't stop this loop.
    const hasAssetsRequest = await getAddressAssetsRaw(address);
    const hasAssets = await hasAssetsRequest?.data?.length;
    if (addressIndex === 0 || hasAssets) {
      createStoreWallet(newWalletData);
      // Add wallet and name to names list
      saveName(addressIndex, walletName);
      // Loop function, bump address index up by one
      return recoverAccountLoop(masterKey, addressIndex + 1);
    } else {
      return 'complete';
    }
  };

  const handleContinue = async () => {
    let latestError = '';
    const derivationMissing = (account === undefined || change === undefined || addressIndex === undefined);
    if (showAdvanced && derivationMissing) latestError = 'Missing derivation path value(s).'
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < passwordMinLength) latestError = `Password must be a minimum of ${passwordMinLength} characters.`;
    if (!latestError) {
      if (tempWallet?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempWallet.mnemonic);
        // const finalDerivationPath = showAdvanced ? derivationPath({ account, change, address_index: addressIndex }) : undefined;
        setLoading(true);
        // Loop over the account to add sub-accounts if they exist
        await recoverAccountLoop(masterKey, 0, tempWallet.walletName);
        setLoading(false);
        // Encrypt data with provided password
        const encrypted = encryptKey(masterKey, walletPassword);
        // Add data to localStorage
        saveKey(encrypted);
        // Remove tempWallet data
        clearTempWallet();
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
      {loading ? <div>Please Wait..</div> : <CtaButton onClick={handleContinue}>Continue</CtaButton>}
    </Wrapper>
  );
};
