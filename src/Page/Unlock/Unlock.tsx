import { useState } from 'react';
import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  getKey,
  getNames,
  decryptKey,
} from 'utils';
import { useWallet } from 'redux/hooks';

const Wrapper = styled.div`
  padding: 42px 16px;
`;

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
        const localAccountNames = getNames();
        createStoreHDWallet({ masterKey, localAccountNames });
        // Redirect to dashboard
        navigate(nextUrl);
      }
    }
    // If we made it this far, update the error
    setError(newError);
  };

  return (
    <Wrapper>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={100} title="Unlock Wallet" backLocation='/' />
      <BodyContent
        $css={css`
          text-align: center;
          margin-bottom: 32px;
        `}
      >
        Enter your password
      </BodyContent>

      <Input
        id="wallet-password"
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={setPassword}
        error={error}
      />
      <CtaButton onClick={handleSubmit}>Continue</CtaButton>
    </Wrapper>
  );
};
