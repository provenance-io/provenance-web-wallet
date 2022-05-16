import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BodyContent,
} from 'Components';
import { APP_URL, ICON_NAMES, PASSWORD_MIN_LENGTH } from 'consts';
import { useNavigate } from 'react-router-dom';
import {
  getKey,
  getAccounts,
  decryptKey,
  getSavedData,
  getSettings,
  saveSettings,
} from 'utils';
import { useAccount } from 'redux/hooks';

interface Props {
  nextUrl: string;
}

export const Unlock = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { addAccounts } = useAccount();
  const passwordMinLength = Number(PASSWORD_MIN_LENGTH)!;

  const handleSubmit = async () => {
    // Clear out any previous error
    setError('');
    let newError = '';
    // Make sure password is at least 5 characters
    if (password.length < passwordMinLength) newError = `Password must be a minimum of ${passwordMinLength} characters.`;
    if (!password) newError = 'Enter a password';
    // No error so far
    if (!newError) {
      const localKey = await getKey();
      // Attempt to decrypt the key with the provided password
      const masterKey = decryptKey(localKey, password);
      if (!masterKey) newError = 'Invalid password';
      else {
        // Password was correct, build the wallets
        const localAccounts = await getAccounts();
        const activeAccountId = await getSavedData('activeAccountId');
        // Pull all settings
        const now = Date.now();
        // TODO: Keep settings defaults in consts file
        const unlockDuration = await getSettings('unlockDuration') || 300000; // default 5min
        saveSettings({ unlockEST: now, unlockEXP: now + unlockDuration }); // Save settings to browser
        addAccounts({ accounts: localAccounts, activeAccountId }); // Save wallet to browser
        
        // Redirect to dashboard
        navigate(nextUrl);
      }
    }
    // If we made it this far, update the error
    setError(newError);
  };

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={100} title="Unlock Wallet" backLocation={APP_URL} />
      <BodyContent>Enter your password</BodyContent>
      <Input
        id="wallet-password"
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={setPassword}
        error={error}
      />
      <Button onClick={handleSubmit} >Continue</Button>
    </Content>
  );
};
