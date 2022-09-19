import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BottomFloat,
  ButtonGroup,
  Typo,
} from 'Components';
import { APP_URL, ICON_NAMES, PASSWORD_MIN_LENGTH, RESET_WALLET_URL } from 'consts';
import { useNavigate } from 'react-router-dom';
import { decryptKey, keyPress } from 'utils';
import { useActiveAccount, useSettings } from 'redux/hooks';

interface Props {
  nextUrl: string;
}

export const Unlock = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { bumpUnlockDuration } = useSettings();
  const { masterKey: key } = useActiveAccount();

  const handleSubmit = async () => {
    // Clear out any previous error
    setError('');
    // Password is required
    if (!password) setError('Enter a password');
    // Make sure password is at least 5 characters
    else if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be a minimum of ${PASSWORD_MIN_LENGTH} characters.`);
    }
    // No error so far
    else {
      // Attempt to decrypt the key with the provided password
      const masterKey = decryptKey(key!, password);
      if (!masterKey) setError('Invalid password');
      else {
        // Bump the unlock duration
        await bumpUnlockDuration();
        // Redirect to dashboard
        navigate(nextUrl);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setError('');
    setPassword(value);
  };

  return (
    <Content>
      <Header
        iconLeft={ICON_NAMES.CLOSE}
        progress={100}
        title="Unlock Wallet"
        backLocation={APP_URL}
      />
      <Typo type="body" marginBottom="32px">
        Enter your password to unlock wallet
      </Typo>
      <Input
        id="wallet-password"
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={handleInputChange}
        autoFocus
        onKeyPress={(e) => {
          keyPress(e, handleSubmit);
        }}
        error={error}
      />
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={handleSubmit}>Continue</Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(RESET_WALLET_URL);
            }}
          >
            Destroy Wallet
          </Button>
        </ButtonGroup>
      </BottomFloat>
    </Content>
  );
};
