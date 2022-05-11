import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BodyContent,
} from 'Components';
import { ICON_NAMES, PASSWORD_MIN_LENGTH } from 'consts';
import { useNavigate } from 'react-router-dom';
import {
  getKey,
  getAccounts,
  decryptKey,
  getSavedData,
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
      console.log('localKey :', localKey);
      console.log('password :', password);
      const masterKey = decryptKey(localKey, password);
      console.log('masterKey :', masterKey);
      if (!masterKey) newError = 'Invalid password';
      else {
        // Password was correct, build the wallets
        const localAccounts = await getAccounts();
        console.log('localAccounts :', localAccounts);
        const activeAccountIndex = await getSavedData('activeAccountIndex');
        console.log('activeAccountIndex :', activeAccountIndex);
        addAccounts({ accounts: localAccounts, activeAccountIndex })
        // Redirect to dashboard
        navigate(nextUrl);
      }
    }
    // If we made it this far, update the error
    setError(newError);
  };

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={100} title="Unlock Wallet" backLocation='/' />
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
