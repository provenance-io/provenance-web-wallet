import styled from 'styled-components';
import { Button, Header, Input, AdvancedSettings } from 'Components';
import {
  ICON_NAMES,
  PASSWORD_MIN_LENGTH,
  DEFAULT_MAINNET_HD_PATH,
} from 'consts';
import { useState } from 'react';
import {
  decryptKey,
  createWalletFromMasterKey,
  // bytesToBase64,
} from 'utils';
import { useNavigate } from 'react-router-dom';
import { useAccount, useActiveAccount } from 'redux/hooks';
import { CustomDerivationPathObject } from 'types';

const Wrapper = styled.div`
  width: 100%;
  label {
    margin-top: 20px;
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
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [HDPath, setHDPath] = useState(DEFAULT_MAINNET_HD_PATH);
  const [walletPassword, setWalletPassword] = useState('');
  const { accounts, addAccount, saveAccountData } = useAccount();
  const { masterKey: key } = useActiveAccount();
  // Loop through all wallets, get the highest ID, increment, and use that as the wallet index
  const [error, setError] = useState<string[]>([]); // [accountNameError, walletPasswordError, genericError]
  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;

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
        // Password was correct, create the account
        // TEMP: Need proper prefix and this file needs to use HD path setup
        const { publicKey } = createWalletFromMasterKey(masterKey);
        // const b64PublicKey = bytesToBase64(publicKey);
        // Save data to redux store and clear out tempAccount data
        const newAccountData = {
          // publicKey: b64PublicKey,
          // address,
          name,
          network: 'mainnet',
        };
        // // Check to make sure this account doesn't already exist
        // if (!accounts.find(account => account.address === address)) {
        //   // Save data to redux and chrome storage
        //   // TODO: This should just be a single function to add into accounts and potentially change activeAccountId (or even key)
        //   await saveAccountData({ activeAccountId: address });
        // } else {
        //   // This account already exists, show generic error
        //   const newErrors = [...error];
        //   newErrors[3] = 'Account is already added/exists'
        //   setError(newErrors);
        // }
        // Redirect back to dashboard menu
        navigate(nextUrl);
      }
    }
    // Update error(s)
    setError(newError);
  };

  return (
    <Wrapper>
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
      {error[3] && <Error>{error[3]}</Error>}
      {/* <AdvancedSettings setResults={(newHDPath) => {setHDPath(newHDPath)}} /> */}
      <Button onClick={handleCreateAccount}>Create</Button>
    </Wrapper>
  );
};
