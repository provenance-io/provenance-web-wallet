import { useState } from 'react';
import { Input, Button, ButtonGroup, BottomFloat } from 'Components';
import { PASSWORD_MIN_LENGTH } from 'consts';
import { decryptKey, createWalletFromMasterKey } from 'utils';
import { useActiveAccount, useSettings } from 'redux/hooks';

interface Props {
  handleApprove: (privateKey: Uint8Array) => void,
  handleDecline: () => void,
  approveText?: string,
  rejectText?: string,
}

export const Authenticate:React.FC<Props> = ({
  handleApprove: approveCallback,
  handleDecline: declineCallback,
  approveText = 'Approve',
  rejectText = 'Reject',
}) => {
  const [walletPassword, setWalletPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { masterKey: key } = useActiveAccount();
  const { unlockDuration, saveSettingsData } = useSettings();

  const handleApprove = async () => {
    let newPasswordError = '';
    // Wallet password must exist
    if (!walletPassword) newPasswordError = 'Enter password';
    // Wallet password must be min length
    if (walletPassword.length < Number(PASSWORD_MIN_LENGTH)) newPasswordError = 'Invalid password';
    // No errors so far and we have a local key to decrypt
    if (!newPasswordError && key) {
      // Wallet password must be correct
      const masterKey = decryptKey(key, walletPassword);
      if (!masterKey) newPasswordError = 'Invalid password';
      // Password was correct
      else {
        // Derive the privateKey
        const { privateKey } = createWalletFromMasterKey(masterKey);
        // Bump the unlock duration
        const now = Date.now();
        await saveSettingsData({ unlockEST: now, unlockEXP: now + unlockDuration! });
        // Run approval callback function
        approveCallback(privateKey);
      }
    }
    // Update error(s)
    setPasswordError(newPasswordError);
  };

  const handleChange = (value: string) => {
    // reset error, set new value
    setPasswordError('');
    setWalletPassword(value);
  }

  return (
    <BottomFloat>
      <ButtonGroup>
        <Input
          placeholder="Enter Wallet Password"
          id="Wallet-Pasword"
          value={walletPassword}
          onChange={handleChange}
          error={passwordError}
          type="password"
        />
        <Button onClick={handleApprove}>{approveText}</Button>
        <Button variant='transparent' onClick={declineCallback}>{rejectText}</Button>
      </ButtonGroup>
    </BottomFloat>
  );
};
