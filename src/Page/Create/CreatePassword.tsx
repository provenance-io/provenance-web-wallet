import { useState } from 'react';
import { BodyContent, Button, Header, Input as InputBase, Content } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'redux/hooks';
import {
  encryptKey,
  createMasterKeyFromMnemonic,
  createWalletFromMasterKey,
  saveKey,
  addSavedData,
  saveAccount,
} from 'utils';

const Error = styled.div`
  color: #ED6E74;
  margin-top: 20px;
  font-size: 1.3rem;
`;
const Input = styled(InputBase)`
  margin-bottom: 30px;
`;

interface Props {
  nextUrl: string;
}

export const CreatePassword = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { tempAccount, addAccount } = useAccount();
  const [walletPassword, setWalletPassword] = useState('');
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const passwordMinLength = Number(process.env.REACT_APP_PASSWORD_MIN_LENGTH)!;

  const handleContinue = async () => {
    let latestError = '';
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < passwordMinLength) latestError = `Password must be a minimum of ${passwordMinLength} characters.`;
    if (!latestError) {
      if (tempAccount?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempAccount.mnemonic);
        const prefix = tempAccount.network === 'mainnet' ?
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_MAINNET :
          process.env.REACT_APP_PROVENANCE_WALLET_PREFIX_TESTNET;
        const { address } = createWalletFromMasterKey(masterKey, prefix);
        // Save data to redux store and clear out tempAccount data
        const id = 0;
        const newAccountData = {
          address,
          accountName: tempAccount.accountName,
          network: tempAccount.network,
          id,
        };
        // ---------------------------------------------
        // Save new account data into browser storage
        // ---------------------------------------------
        await addSavedData({
          connected: true,
          connectedIat: new Date().getTime(),
          activeAccountIndex: id,
        });
        await saveAccount(newAccountData);
        // Encrypt data with provided password
        const encrypted = encryptKey(masterKey, walletPassword);
        // Add data to localStorage
        await saveKey(encrypted);
        // Add account into redux store
        addAccount(newAccountData);
        // This is the first account in the list, index will be 0
        navigate(nextUrl);
      } else {
        latestError = 'Unable to locally save account, please try again later'
      }
    }
    setError(latestError);
  };

  return (
    <Content>
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
      <Button onClick={handleContinue} >Continue</Button>
    </Content>
  );
};
