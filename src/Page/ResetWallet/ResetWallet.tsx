import { Header, Input, Button, BottomFloat, Alert, Typo } from 'Components';
import { APP_URL, ICON_NAMES } from 'consts';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount, useSettings, useWalletConnect } from 'redux/hooks';
import styled from 'styled-components';
import { keyPress } from 'utils';

const InputSection = styled.div`
  width: 100%;
  input {
    margin-bottom: 20px;
  }
`;
const Phrase = styled.div`
  width: 100%;
  padding: 8px;
  background: #494949;
  font-size: 1.4rem;
  color: #b0b0b0;
  font-weight: bold;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 40px;
`;

export const ResetWallet: React.FC = () => {
  const { resetAccountData } = useAccount();
  const { resetSettingsData } = useSettings();
  const { resetWalletConnectData } = useWalletConnect();
  const [confirmationText, setConfirmationText] = useState('');
  const [inputError, setInputError] = useState<string>('');
  const navigate = useNavigate();
  const destroyPhrase = 'destroy my wallet';

  const validateInputField = () => {
    let newError = '';
    if (confirmationText !== destroyPhrase)
      newError = 'Enter correct destruction phrase.';
    if (!confirmationText) newError = 'Destruction phrase required.';
    // Save new errors to state
    setInputError(newError);
    return !newError;
  };

  const submitDestroyWallet = async () => {
    if (validateInputField()) {
      // Destroy all accounts/settings/data
      await resetWalletConnectData();
      await resetAccountData();
      await resetSettingsData();
      // Navigate to landing page (Note: This will probably happen automatically due to store changes)
      navigate(APP_URL);
    }
  };

  const handleInputChange = (value: string) => {
    setInputError('');
    setConfirmationText(value);
  };

  return (
    <>
      <Header
        title="Destroy Wallet"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={APP_URL}
      />
      <Alert type="warning" title="Warning">
        You are about to remove all accounts from this wallet. This action cannot be
        undone. Accounts can only be recovered with their recovery seed phrase.
      </Alert>
      <Typo type="headline2" align="left" marginBottom="10px" marginTop="20px">
        Destruction phrase:
      </Typo>
      <Phrase>"{destroyPhrase}"</Phrase>
      <InputSection>
        <Input
          id="destroyWallets"
          value={confirmationText}
          onChange={handleInputChange}
          placeholder="Enter phrase"
          label="Destruction Phrase"
          error={inputError}
          onKeyPress={(e) => keyPress(e, submitDestroyWallet)}
        />
      </InputSection>
      <BottomFloat>
        <Button onClick={submitDestroyWallet}>Destroy Wallet</Button>
      </BottomFloat>
    </>
  );
};
