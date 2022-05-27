import { useState } from 'react';
import { BodyContent, Button, Header, Input as InputBase, Content } from 'Components';
import {
  APP_URL,
  ICON_NAMES,
  PASSWORD_MIN_LENGTH,
  PROVENANCE_ADDRESS_PREFIX_MAINNET,
  PROVENANCE_ADDRESS_PREFIX_TESTNET,
} from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount, useSettings } from 'redux/hooks';
import {
  encryptKey,
  createMasterKeyFromMnemonic,
  createWalletFromMasterKey,
  bytesToBase64,
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
  const { tempAccount, addAccount, saveAccountData } = useAccount();
  const { unlockDuration, saveSettingsData } = useSettings();
  const [walletPassword, setWalletPassword] = useState('');
  const [walletPasswordRepeat, setWalletPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;

  const handleContinue = async () => {
    let latestError = '';
    if (walletPassword !== walletPasswordRepeat) latestError = 'Passwords must match';
    if (!walletPassword || !walletPasswordRepeat) latestError = 'Please confirm your password.';
    if (walletPassword.length < passwordMinLength) latestError = `Password must be a minimum of ${passwordMinLength} characters.`;
    if (!latestError) {
      if (tempAccount?.mnemonic) {
        // Generate master keyt and get data about wallet
        const masterKey = createMasterKeyFromMnemonic(tempAccount.mnemonic);
        const prefix = tempAccount.network === 'mainnet' ? PROVENANCE_ADDRESS_PREFIX_MAINNET : PROVENANCE_ADDRESS_PREFIX_TESTNET;
        const { address, publicKey } = createWalletFromMasterKey(masterKey, prefix);
        const b64PublicKey = bytesToBase64(publicKey);
        // Save data to redux store and clear out tempAccount data
        const id = 0;
        const newAccountData = {
          publicKey: b64PublicKey,
          address,
          name: tempAccount.name,
          network: tempAccount.network,
          id,
        };
        // -------------------------------------------------------
        // Save new account data into browser / redux storage
        // -------------------------------------------------------
        const key = encryptKey(masterKey, walletPassword);
        // TODO: Maybe create function to do both of these instead of having two
        // Save account data overwrites all existing data
        saveAccountData({ activeAccountId: id, key });
        // Use addAccount to "merge" into existing data
        addAccount(newAccountData);
        const now = Date.now();
        saveSettingsData({ unlockEST: now, unlockEXP: now + unlockDuration! });
        navigate(nextUrl);
      } else {
        latestError = 'Unable to locally save account, please try again later'
      }
    }
    setError(latestError);
  };

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Account Password" backLocation={APP_URL} />
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
