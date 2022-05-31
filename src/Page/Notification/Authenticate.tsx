import { useState } from 'react';
import { Input, Button, ButtonGroup } from 'Components';
import { PASSWORD_MIN_LENGTH } from 'consts';
import { decryptKey, createWalletFromMasterKey } from 'utils';
import { useAccount, useSettings } from 'redux/hooks';

interface Props {
  handleApprove: () => void,
  handleDecline: () => void,
  handleAuth?: (privateKey: Uint8Array) => void,
  background?: string,
}

export const Authenticate:React.FC<Props> = ({ handleApprove, handleDecline, handleAuth, background }) => {
  const [walletPassword, setWalletPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { key } = useAccount();
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
        // TODO: Indicate if you want this account to be mainnet or testnet
        // const network = 'testnet';
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
      <ButtonGroup background={background}>
        <Button layout="default" onClick={handleApprove}>Approve</Button>
        <Button layout="default" variant='transparent' onClick={handleDecline}>Reject</Button>
      </ButtonGroup>
    ) : (
      <ButtonGroup background={background}>
        <Input
          placeholder="Enter Wallet Password"
          id="Wallet-Pasword"
          value={walletPassword}
          onChange={setWalletPassword}
          error={passwordError}
          type="password"
        />
        <Button layout="default" onClick={handleAuthAccount}>Authenticate</Button>
        <Button layout="default" variant='transparent' onClick={handleDecline}>Reject</Button>
      </ButtonGroup>
    )
  );
};
