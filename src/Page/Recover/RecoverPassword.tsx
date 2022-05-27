import { useState } from 'react';
import { BodyContent, Button, Header, Input, Select } from 'Components';
import {
  ICON_NAMES,
  PASSWORD_MIN_LENGTH,
  DEFAULT_ACCOUNT_NAME,
  PROVENANCE_ADDRESS_PREFIX_MAINNET,
  PROVENANCE_ADDRESS_PREFIX_TESTNET,
  APP_URL,
  PROVENANCE_WALLET_COIN_TYPE,
  DEFAULT_NETWORK,
  MAINNET_NETWORK,
  TESTNET_NETWORK,
  TESTNET_WALLET_COIN_TYPE,
} from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount, useAddress, useSettings } from 'redux/hooks';
import { BIP32Interface } from 'bip32';
import {
  encryptKey,
  createMasterKeyFromMnemonic,
  bytesToBase64,
  createWalletFromMasterKey,
  derivationPath,
} from 'utils';
import backupComplete from 'images/backup-complete.svg';
import { CustomDerivationPathObject } from 'types';

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
const Image = styled.img`
  width: 160px;
  display: flex;
  margin: 50px auto;
`;

interface Props {
  nextUrl: string;
}

export const RecoverPassword = ({ nextUrl }: Props) => {
  // Hooks
  const navigate = useNavigate();
  const { getAddressAssetsCount } = useAddress();
  const {
    tempAccount,
    clearTempAccount,
    addAccount,
    saveAccountData,
  } = useAccount();
  const { unlockDuration, saveSettingsData } = useSettings();
  // Local Component States
  const [walletPassword, setWalletPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customDerivationPath, setCustomDerivationPath] = useState<CustomDerivationPathObject>({
    coin_type: 505,
    account: 0,
    change: 0,
    addressIndex: 0,
  });
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [error, setError] = useState('');

  const recoverAccountLoop = async (masterKey: BIP32Interface, addressIndex: number = 0, accountName?: string): Promise<string> => {
    const path = derivationPath({ ...customDerivationPath, address_index: addressIndex });
    const prefix = network === MAINNET_NETWORK ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
    const { address, publicKey } = createWalletFromMasterKey(masterKey, prefix, path);
    const b64PublicKey = bytesToBase64(publicKey);
    const name = accountName || `${DEFAULT_ACCOUNT_NAME}${addressIndex + 1}`;
    // Save data to redux store and clear out tempAccount data
    const newWalletData = {
      address,
      publicKey: b64PublicKey,
      name,
      network,
      id: addressIndex,
    };
    // Loop up to see if account holds any hash, if it does, add it, if it doesn't stop this loop.
    const hasAssets = await getAddressAssetsCount(address);
    // TODO: User might want to add address #42 and it has no assets
    if (addressIndex === 0 || hasAssets) {
      // Save to chrome and redux storage
      addAccount(newWalletData);
      // Loop function, bump address index up by one
      return recoverAccountLoop(masterKey, addressIndex + 1);
    } else {
      return 'complete';
    }
  };

  const handleContinue = async () => {
    let latestError = '';
    const { account, change, addressIndex, coin_type } = customDerivationPath;
    const derivationMissing = (
      account === undefined ||
      change === undefined ||
      addressIndex === undefined ||
      coin_type === undefined
    );
    if (showAdvanced && derivationMissing) latestError = 'Missing derivation path value(s).'
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < PASSWORD_MIN_LENGTH) latestError = `Password must be a minimum of ${PASSWORD_MIN_LENGTH} characters.`;
    if (!latestError) {
      if (tempAccount?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempAccount.mnemonic);
        setLoading(true);
        // Loop over the account to add sub-accounts if they exist
        await recoverAccountLoop(masterKey, 0, tempAccount.name);
        // Encrypt data with provided password
        const key = encryptKey(masterKey, walletPassword);
        // Add data to chrome and redux storage
        saveAccountData({ key, activeAccountId: 0 })
        setLoading(false);
        // Remove tempAccount data
        clearTempAccount();
        // Save settings for connectionEST
        const now = Date.now();
        const exp = now + unlockDuration!;
        saveSettingsData({
          unlockEST: now,
          unlockEXP: exp,
        });
        setSuccess(true);
      } else {
        latestError = 'Unable to locally save account, please try again later'
      }
    }
    setError(latestError);
  };

  const toggleShowAdvanced = () => {
    if (showAdvanced) {
      setCustomDerivationPath({});
      setShowAdvanced(false);
      setNetwork(DEFAULT_NETWORK);
    }
    else setShowAdvanced(true);
  }

  const changeCustomDerivationPath = (target: keyof CustomDerivationPathObject, value: string) => {
    const newCustomDerivationPath = {...customDerivationPath};
    newCustomDerivationPath[target] = Number(value);
    setCustomDerivationPath(newCustomDerivationPath);
  };

  const updateNetwork = (value: string) => {
    setNetwork(value);
    changeCustomDerivationPath('coin_type', (value === TESTNET_NETWORK) ? `${TESTNET_WALLET_COIN_TYPE}` : `${PROVENANCE_WALLET_COIN_TYPE}`);
  }

  const { account, change, addressIndex, coin_type } = customDerivationPath;
  return (
    success ? (
      <Wrapper>
        <Header progress={100} title="Account(s) Recovered" />
        <Image src={backupComplete} />
        <BodyContent
          $css={css`
            text-align: center;
            margin-bottom: 32px;
          `}
        >
          Your accounts were successfully recovered!
        </BodyContent>
        <Button onClick={() => navigate(nextUrl)} >Continue</Button>
      </Wrapper>
    ) : (
      <Wrapper>
        <Header iconLeft={ICON_NAMES.CLOSE} progress={66} title="Account Password" backLocation={APP_URL} />
        <BodyContent
          $css={css`
            text-align: center;
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
              m/44'/<Input type="number" id="coin" value={coin_type !== undefined ? coin_type : ''} onChange={(value) => changeCustomDerivationPath('account', value) } />'/<Input type="number" id="account" value={account !== undefined ? account : ''} onChange={(value) => changeCustomDerivationPath('account', value) } />'/<Input type="number" id="change" value={change !== undefined ? change : ''} onChange={(value) => changeCustomDerivationPath('change', value) } />/<Input type="number" id="addressIndex" value={addressIndex !== undefined ? addressIndex : ''} onChange={(value) => changeCustomDerivationPath('addressIndex', value) } />
            </AdvancedInputArea>
            <Select label="Network" options={[MAINNET_NETWORK, TESTNET_NETWORK]} value={network} onChange={updateNetwork} />
          </AdvancedSection>
        )}
        {loading ? <div>Please Wait..</div> : <Button  onClick={handleContinue}>Continue</Button>}
      </Wrapper>
    )
  );
};
