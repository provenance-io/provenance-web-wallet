import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BodyContent,
} from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import {
  getKey,
  getAccounts,
  decryptKey,
} from 'utils';
import { useWallet } from 'redux/hooks';

interface Props {
  nextUrl: string;
}

export const Unlock = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { createHDWallet: createStoreHDWallet } = useWallet();
  const localKey = getKey();

  const passwordMinLength = Number(process.env.REACT_APP_PASSWORD_MIN_LENGTH)!;

  const handleSubmit = () => {
    // Clear out any previous error
    setError('');
    let newError = '';
    // Make sure password is at least 5 characters
    if (password.length < passwordMinLength) newError = `Password must be a minimum of ${passwordMinLength} characters.`;
    if (!password) newError = 'Enter a password';
    // No error so far
    if (!newError) {
      // Attempt to decrypt the key with the provided password
      const masterKey = decryptKey(localKey, password);
      if (!masterKey) newError = 'Invalid password';
      else {
        // Password was correct, build the wallets
        const localAccounts = getAccounts();
        createStoreHDWallet({ masterKey, localAccounts });
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
