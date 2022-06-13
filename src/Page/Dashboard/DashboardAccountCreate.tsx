import styled from 'styled-components';
import { Button, Header, Input, Select, Success } from 'Components';
import {
  ICON_NAMES,
  MAINNET_NETWORK,
  PASSWORD_MIN_LENGTH,
  DEFAULT_NETWORK,
  TESTNET_NETWORK,
  TESTNET_WALLET_COIN_TYPE,
  PROVENANCE_WALLET_COIN_TYPE,
  PROVENANCE_ADDRESS_PREFIX_MAINNET,
  PROVENANCE_ADDRESS_PREFIX_TESTNET,
} from 'consts';
import { useState } from 'react';
import {
  decryptKey,
  derivationPath,
  createWalletFromMasterKey,
  bytesToBase64,
} from 'utils';
import { useAccount } from 'redux/hooks';
import { CustomDerivationPathObject } from 'types';

const Wrapper = styled.div`
  width: 100%;
  label {
    margin-top: 20px;
  }
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
const Error = styled.div`
  color: #ED6E74;
  margin-top: 20px;
  font-size: 1.3rem;
`;

interface Props {
  nextUrl: string,
}

export const DashboardAccountCreate:React.FC<Props> = ({ nextUrl }) => {  
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);
  const [walletPassword, setWalletPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const { accounts, key, addAccount, saveAccountData } = useAccount();
  // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
  const sortedWallets = [...accounts].sort((a, b) => a.id! < b.id! ? 1 : -1);
  const highestId = sortedWallets[0].id || 0;
  const [customDerivationPath, setCustomDerivationPath] = useState<CustomDerivationPathObject>({
    coin_type: 505,
    account: 0,
    change: 0,
    addressIndex: highestId + 1,
  });
  const [error, setError] = useState<string[]>([]); // [accountNameError, walletPasswordError, genericError]
  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;
  
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

  const handleCreateAccount = async () => {
    let newError = [];
    // Account name must exist
    if (!name) newError[0] = 'Account Name Required';
    // Wallet password must exist
    if (!walletPassword) newError[1] = 'Wallet Password Required';
    // Wallet password must be min length
    if (walletPassword.length < passwordMinLength) newError[1] = `Password must be a minimum of ${passwordMinLength} characters.`;
    // No errors so far and we have a local key to decrypt
    if (!newError.length && key) {
      console.log('!newError.length && key :', !newError.length && key);
      // Wallet password must be correct
      const masterKey = decryptKey(key, walletPassword);
      if (!masterKey) newError[1] = 'Invalid password';
      else {
        // Get the id to use
        // If advanced is toggled, use the addressIndex in the HD path or else get the highest current account and go up one
        const id = showAdvanced ? customDerivationPath.addressIndex : highestId + 1;
        console.log('id :', id);
        const prefix = network === MAINNET_NETWORK ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
        console.log('prefix :', prefix);
        const path = showAdvanced ?
          derivationPath({ ...customDerivationPath, address_index: id }) :
          derivationPath({ address_index: id });
        console.log('path :', path);
        // Password was correct, create the account
        const { address, publicKey } = createWalletFromMasterKey(masterKey, prefix, path);
        const b64PublicKey = bytesToBase64(publicKey);
        // Save data to redux store and clear out tempAccount data
        const newAccountData = {
          publicKey: b64PublicKey,
          address,
          name,
          network,
          id,
        };
        console.log('newAccountData :', newAccountData);
        // Check to make sure this account doesn't already exist
        if (!accounts[id!]) {
          // Save data to redux and chrome storage
          // TODO: This should just be a single function to add into accounts and potentially change activeAccountId (or even key)
          await addAccount(newAccountData);
          await saveAccountData({ activeAccountId: id });
        } else {
          // This account already exists, show generic error
          const newErrors = [...error];
          newErrors[3] = 'Account is already added/exists'
          setError(newErrors);
        }
        // Show success message
        setSuccess(true);
      }
    }
    // Update error(s)
    setError(newError);
  };

  const { account, change, addressIndex, coin_type } = customDerivationPath;

  return (
    <>
    {!success && <Wrapper>
      <Header title='Create New Account' iconLeft={ICON_NAMES.CLOSE} />
      <Input
        label="Account Name"
        placeholder="Enter Account Name"
        id="Account-Name"
        value={name}
        onChange={setName}
        error={error[0]}
      />
      <Input
        label="Wallet Password"
        placeholder="Enter Wallet Password"
        id="Wallet-Pasword"
        value={walletPassword}
        onChange={setWalletPassword}
        error={error[1]}
        type="password"
      />
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
      {error[3] && <Error>{error[3]}</Error>}
      <Button onClick={handleCreateAccount}>Create</Button>
    </Wrapper>}
    {success && <Success title='account created' subTitle='Account creation was successful' />}
    </>
  );
};
