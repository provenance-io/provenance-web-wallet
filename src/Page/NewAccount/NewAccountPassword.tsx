import { useState } from 'react';
import {
  Button,
  Header,
  Input as InputBase,
  Content,
  Typo,
} from 'Components';
import {
  ICON_NAMES,
  PASSWORD_MIN_LENGTH,
} from 'consts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount, useSettings } from 'redux/hooks';
import {
  encryptKey,
  createRootAccount,
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
  previousUrl: string;
  flowType: 'create' | 'add' | 'recover';
}

export const NewAccountPassword = ({ nextUrl, previousUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const { tempAccount, addAccount } = useAccount();
  const { bumpUnlockDuration } = useSettings();
  const [walletPassword, setWalletPassword] = useState<string[]>([]); // [password, repeated-password]
  const [errors, setErrors] = useState<string[]>([]); // [password-error, repeated-password-error, generic-error]

  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;
  const isAddAccount = flowType === 'add';
  const password = walletPassword[0];
  const repeatedPassword = walletPassword[1];

  // Password is stored as an array [password, repeated-password]
  const updatePassword = (value: string, repeated?: boolean) => {
    const targetIndex = repeated ? 1 : 0; // [password, repeated-password];
    const newWalletPassword = [...walletPassword];
    newWalletPassword[targetIndex] = value;
    setWalletPassword(newWalletPassword);
  };

  const handleContinue = async () => {
    let latestErrors = [];
    // Check repeated password (flowType of 'add' will not have the password repeat input)
    if (!isAddAccount) {
      if (password !== repeatedPassword) latestErrors[1] = 'Passwords must match.';
      if (!repeatedPassword) latestErrors[1] = 'Please confirm your password.';
    }
    // Check password min-length
    if (!password || password.length < passwordMinLength) latestErrors[0] = `Password must be a minimum of ${passwordMinLength} characters.`;
    // If there are no errors, continue
    if (!latestErrors.length) {
      // Create main root account based on the HD path
      const {
        masterKey: rootMasterKey,
        address,
        publicKey,
        network,
        accountLevel,
      } = createRootAccount(tempAccount!.mnemonic!, tempAccount!.hdPath!);
      const masterKey = encryptKey(rootMasterKey!, password);
      // Save data to redux store and clear out tempAccount data
      const newAccountData = {
        publicKey,
        address,
        name: tempAccount!.name,
        network: network,
        masterKey,
        accountLevel,
      };
      // -------------------------------------------------------
      // Save new account data into browser / redux storage
      // -------------------------------------------------------
      await addAccount(newAccountData);
      await bumpUnlockDuration();
      navigate(nextUrl);
    }
    // Update error
    setErrors(latestErrors);
  };

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={80} title="Wallet Password" backLocation={previousUrl} />
      <Typo type='body'>
        Enter a wallet password. This password will be used for permissions, authentication, and unlocking. This password is only stored locally.
      </Typo>

      <Input
        id="wallet-password"
        label="Wallet Password"
        type="password"
        placeholder="Enter Wallet Password"
        value={password}
        onChange={(value) => updatePassword(value)}
        error={errors[0]}
      />
      {!isAddAccount && (
        <Input
          id="wallet-password-repeat"
          label="Confirm Wallet Password"
          type="password"
          placeholder="Confirm Wallet Password"
          value={repeatedPassword}
          onChange={(value) => updatePassword(value, true)}
          error={errors[1]}
        />
      )}
      
      {errors[3] && <Error>{errors[3]}</Error>}
      <Button onClick={handleContinue}>Continue</Button>
    </Content>
  );
};
