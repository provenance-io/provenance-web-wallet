import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Button, Header, Input } from 'Components';
import { ICON_NAMES, SEND_COMPLETE_URL } from 'consts';
import { useMessage } from 'redux/hooks';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
`;

export const SendReview = () => {
  const navigate = useNavigate();
  const { coin } = useMessage();
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const signAndNavigate = () => {
    if (!password) {
      return setError('Please enter your password to');
    }

    navigate(SEND_COMPLETE_URL);
  };

  return !coin ? null : (
    <Wrapper>
      <Header title="Send Review" iconLeft={ICON_NAMES.ARROW} />
      <h2>Confirm your information</h2>
      <p>Please review the details below to make sure everything is correct.</p>

      <Input
        autoFocus
        id="walletPassword"
        label="Password"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={setPassword}
        onKeyDown={({ key }) => key === 'Enter' && signAndNavigate()}
        error={error}
      />
      <Button onClick={signAndNavigate}>Sign &amp; Send</Button>
    </Wrapper>
  );
};
