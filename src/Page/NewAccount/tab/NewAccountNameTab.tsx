import { useState } from 'react';
import {
  AdvancedSettings,
  Button as ButtonBase,
  Checkbox,
  FullPage,
  Input,
  Typo,
} from 'Components';
import { DEFAULT_MAINNET_HD_PATH } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount } from 'redux/hooks';
import { keyPress } from 'utils';
import type { FlowType } from 'types';
import { COLORS } from 'theme';

const AdvancedSettingsCheckbox = styled(Checkbox)<{ active: boolean }>`
  width: 100%;
  display: flex;
  margin: 20px 0;
  div {
    ${({ active }) => !active && `border: 1px solid ${COLORS.NEUTRAL_300};`}
  }
  label {
    font-weight: bold;
  }
`;
const Button = styled(ButtonBase)`
  margin-top: 40px;
`;

interface Props {
  nextUrl: string;
  flowType: FlowType;
}

export const NewAccountNameTab = ({ nextUrl, flowType }: Props) => {
  const [error, setError] = useState('');
  const [hdPath, setHdPath] = useState(DEFAULT_MAINNET_HD_PATH);
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const { updateTempAccount, tempAccount } = useAccount();
  const [name, setName] = useState(tempAccount?.name || '');

  const handleContinue = async () => {
    const validLength = name.length > 2 && name.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(name);
    let newError = '';
    if (!validCharacters)
      newError = 'Name must only contain alphanumeric characters.';
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.';
    if (!name) newError = 'Please enter an account';
    if (!newError) {
      // We get the HDPath from 3 places: -AdvancedSettings, -DEFAULT_HD_PATH, -ParentAccountHdPath
      updateTempAccount({
        name,
        hdPath,
      });
      // Change the hash for the nextUrl
      window.location.hash = `#${nextUrl}`;
      // Move to next step
      navigate(nextUrl);
    } else {
      setError(newError);
    }
  };

  const toggleShowAdvanced = () => {
    if (showAdvanced) {
      // Restore path to default
      setHdPath(DEFAULT_MAINNET_HD_PATH);
      // Reset continue button status
      setContinueDisabled(false);
      // Close menu
      setShowAdvanced(false);
    }
    // Open the advanced menu
    else setShowAdvanced(true);
  };

  const handleInputChange = (value: string) => {
    setError('');
    setName(value);
  };

  return (
    <FullPage title={flowType === 'add' ? 'Add New Account' : 'Create New Account'}>
      <Typo type="body" marginBottom="26px" marginTop="10px" align="left">
        Enter an account name to easily identify it while using the Provenance
        Blockchain Wallet.
      </Typo>
      <Input
        id="accountName"
        label="Account Name"
        placeholder="Enter account name"
        value={name}
        onChange={handleInputChange}
        error={error}
        onKeyPress={(e) => keyPress(e, handleContinue)}
        autoFocus
      />
      <AdvancedSettingsCheckbox
        label="Advanced Settings"
        checked={showAdvanced}
        onChange={toggleShowAdvanced}
        data-testid="advanced-settings"
        active={showAdvanced}
      />
      {showAdvanced && (
        <AdvancedSettings
          setResults={(newHdPath) => {
            setHdPath(newHdPath);
          }}
          setContinueDisabled={setContinueDisabled}
        />
      )}
      <Button
        onClick={handleContinue}
        disabled={continueDisabled}
        title={`${continueDisabled ? 'Required HD Path value missing' : ''}`}
      >
        Continue
      </Button>
    </FullPage>
  );
};
