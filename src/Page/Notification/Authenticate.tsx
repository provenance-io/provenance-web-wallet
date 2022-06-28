import { useState } from 'react';
import { Input, Button, ButtonGroup, BottomFloat } from 'Components';
import { PASSWORD_MIN_LENGTH } from 'consts';
import { decryptKey, createWalletFromMasterKey } from 'utils';
import { useActiveAccount, useSettings } from 'redux/hooks';

interface Props {
  handleApprove: () => void,
  handleDecline: () => void,
  handleAuth?: (privateKey: Uint8Array) => void,
}

export const Authenticate:React.FC<Props> = ({ handleApprove, handleDecline, handleAuth }) => {
  const [walletPassword, setWalletPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { masterKey: key } = useActiveAccount();
  const { unlockDuration, saveSettingsData } = useSettings();

  const handleAuthAccount = async () => {
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
        if (handleAuth) handleAuth(privateKey);
        // Update local authentication status
        setAuthenticated(true);
        // Bump the unlock duration
        const now = Date.now();
        await saveSettingsData({ unlockEST: now, unlockEXP: now + unlockDuration! });
      }
    }
    // Update error(s)
    setPasswordError(newPasswordError);
  };

  return (
    authenticated ? (
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={handleApprove}>Approve</Button>
          <Button variant='transparent' onClick={handleDecline}>Reject</Button>
        </ButtonGroup>
      </BottomFloat>
    ) : (
      <BottomFloat>
        <ButtonGroup>
          <Input
            placeholder="Enter Wallet Password"
            id="Wallet-Pasword"
            value={walletPassword}
            onChange={setWalletPassword}
            error={passwordError}
            type="password"
          />
          <Button onClick={handleAuthAccount}>Authenticate</Button>
          <Button variant='transparent' onClick={handleDecline}>Reject</Button>
        </ButtonGroup>
      </BottomFloat>
    )
  );
};
