import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BodyContent,
  BottomFloat,
  ButtonGroup,
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
  const { unlockDuration, saveSettingsData } = useSettings();
  const { masterKey: key } = useActiveAccount();

  const handleSubmit = async () => {
    // Clear out any previous error
    setError('');
    let newError = '';
    // Make sure password is at least 5 characters
    if (password.length < PASSWORD_MIN_LENGTH)
      newError = `Password must be a minimum of ${PASSWORD_MIN_LENGTH} characters.`;
    if (!password) newError = 'Enter a password';
    // No error so far
    if (!newError) {
      // Attempt to decrypt the key with the provided password
      const masterKey = decryptKey(key!, password);
      if (!masterKey) newError = 'Invalid password';
      else {
        // Bump the unlock duration
        const now = Date.now();
        await saveSettingsData({ unlockEST: now, unlockEXP: now + unlockDuration! });
        // Redirect to dashboard
        navigate(nextUrl);
      }
    }
    // If we made it this far, update the error
    setError(newError);
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
      <BodyContent>Enter your password to unlock wallet</BodyContent>
      <Input
        id="wallet-password"
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={handleInputChange}
        autoFocus
        onKeyUp={(e) => {
          keyPress(e, 'Enter', handleSubmit);
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
