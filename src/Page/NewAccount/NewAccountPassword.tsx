import { useState } from 'react';
import { Button, Input as InputBase, FullPage, Typo } from 'Components';
import { PASSWORD_MIN_LENGTH } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  useAccount,
  useSettings,
  useActiveAccount,
  useWalletConnect,
} from 'redux/hooks';
import {
  encryptKey,
  createRootAccount,
  createChildAccount,
  decryptKey,
  keyPress,
} from 'utils';
import type { Account, FlowType } from 'types';

const Input = styled(InputBase)`
  margin-bottom: 30px;
`;

interface Props {
  nextUrl: string;
  flowType: FlowType;
}

export const NewAccountPassword = ({ nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const { connector } = useWalletConnect();
  const { tempAccount, addAccount, accounts } = useAccount();
  const { bumpUnlockDuration } = useSettings();
  const [walletPassword, setWalletPassword] = useState<string[]>(['', '']); // [password, repeated-password]
  const [errors, setErrors] = useState<string[]>([]); // [password-error, repeated-password-error]
  const { masterKey: key } = useActiveAccount();

  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;
  // Check for each flotType
  const isSubAccount = flowType === 'sub';
  const isImportAccount = flowType === 'import';
  const isAddAccount = flowType === 'add';
  const isCreateAccount = flowType === 'create';
  const isRecoverAccount = flowType === 'recover';
  const additionalAccount = isSubAccount || isImportAccount || isAddAccount;
  const enterNewPassword = isCreateAccount || isRecoverAccount;
  const password = walletPassword[0];
  const repeatedPassword = walletPassword[1];
  const accountsExist = accounts.length;

  // Password is stored as an array [password, repeated-password]
  const updatePassword = (value: string, passwordConfirm?: boolean) => {
    const targetIndex = passwordConfirm ? 1 : 0; // [password, repeated-password];
    const newWalletPassword = [...walletPassword];
    newWalletPassword[targetIndex] = value;
    setWalletPassword(newWalletPassword);
  };

  const handleContinue = async () => {
    let latestErrors = [];
    // Check repeated password (For flowtypes with a new wallet password)
    if (enterNewPassword) {
      if (password !== repeatedPassword) latestErrors[1] = 'Passwords must match.';
      if (!repeatedPassword) latestErrors[1] = 'Please confirm your password.';
    }
    // Check password min-length
    if (!password || password.length < passwordMinLength)
      latestErrors[0] = `Password must be a minimum of ${passwordMinLength} characters.`;
    // Check to make sure the password is correct (when not creating first account)
    if (accountsExist) {
      const decodedParentMasterKey = decryptKey(key!, password);
      if (!decodedParentMasterKey) latestErrors[0] = 'Invalid password';
    }
    // If there are no errors, continue
    if (!latestErrors.length) {
      let fullNewAccountData = {} as Account;
      const isChildAccount =
        !!tempAccount?.parentMasterKey && !!tempAccount?.parentHdPath;
      // Are we creating a new account or adding an account to a parent? (check for tempaccount parentMasterKey & parentHdPath)
      if (isChildAccount) {
        // Take the password entered and decode the parent masterKey for use
        const decodedParentMasterKey = decryptKey(
          tempAccount!.parentMasterKey!,
          password
        );
        fullNewAccountData = createChildAccount(
          decodedParentMasterKey,
          tempAccount!.parentHdPath!,
          tempAccount!.hdPath
        );
      } else {
        // Create main root account based on the HD path
        fullNewAccountData = createRootAccount(
          tempAccount!.mnemonic!,
          tempAccount!.hdPath!
        );
      }
      const { masterKey, publicKey, address, network, hdPath, accountLevel } =
        fullNewAccountData;
      const encryptedMasterKey = encryptKey(masterKey!, password);
      // Save data to redux store and clear out tempAccount data
      const newAccountData = {
        publicKey,
        address,
        name: tempAccount!.name,
        network,
        masterKey: encryptedMasterKey,
        accountLevel,
        hdPath,
      };
      // -------------------------------------------------------
      // Save new account data into browser / redux storage
      // -------------------------------------------------------
      await addAccount(newAccountData);
      await bumpUnlockDuration();
      // Since adding an account will automatically set it to active, we need to kill any previous active account connections
      if (connector) connector.killSession();
      // Change the hash for the nextUrl
      window.location.hash = `#${nextUrl}`;
      navigate(nextUrl);
    } else {
      // Update error
      setErrors(latestErrors);
    }
  };

  const handleInputChange = (
    value: string,
    errorIndex: number,
    passwordConfirm?: boolean
  ) => {
    const updatedErrors = [...errors];
    updatedErrors[errorIndex] = '';
    updatePassword(value, passwordConfirm);
  };

  return (
    <FullPage title="Wallet Password">
      <Typo type="body" marginBottom="40px" align="left">
        {additionalAccount
          ? 'Existing wallet password. Your password is required to add/import additional accounts.'
          : 'Enter a wallet password. This password will be used for permissions, authentication, and unlocking. This password is only stored locally.'}
      </Typo>
      <Input
        id="wallet-password"
        label="Wallet Password"
        type="password"
        placeholder="Enter Wallet Password"
        value={password}
        onChange={(value) => handleInputChange(value, 0)}
        error={errors[0]}
        onKeyPress={(e) => keyPress(e, handleContinue)}
        autoFocus
      />
      {enterNewPassword && (
        <Input
          id="wallet-password-repeat"
          label="Confirm Wallet Password"
          type="password"
          placeholder="Confirm Wallet Password"
          value={repeatedPassword}
          onChange={(value) => handleInputChange(value, 1, true)}
          error={errors[1]}
          onKeyPress={(e) => keyPress(e, handleContinue)}
        />
      )}
      <Button onClick={handleContinue}>Continue</Button>
    </FullPage>
  );
};
