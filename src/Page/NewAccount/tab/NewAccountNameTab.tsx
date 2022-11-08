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
import {
  useAccount,
  useActiveAccount,
  useSettings,
  useWalletConnect,
} from 'redux/hooks';
import { completeHdPath, keyPress } from 'utils';
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
  progress: number;
}

export const NewAccountNameTab = ({ nextUrl, flowType }: Props) => {
  // Shorthand flowtypes
  const flowTypeSub = flowType === 'sub';
  const flowTypeRecover = flowType === 'recover';
  const { hdPath: parentHdPath, masterKey: parentMasterKey } = useActiveAccount();

  const defaultHdPath = flowTypeSub
    ? completeHdPath(parentHdPath!, "0'", true)
    : DEFAULT_MAINNET_HD_PATH;

  const [error, setError] = useState('');
  const [hdPath, setHdPath] = useState(defaultHdPath);
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const { updateTempAccount, resetAccountData, tempAccount } = useAccount();
  const [name, setName] = useState(tempAccount?.name || '');
  const { resetSettingsData } = useSettings();
  const { resetWalletConnectData } = useWalletConnect();

  const handleContinue = async () => {
    const validLength = name.length > 2 && name.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(name);
    let newError = '';
    if (!validCharacters)
      newError = 'Name must only contain alphanumeric characters.';
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.';
    if (!name) newError = 'Please enter an account';
    if (!newError) {
      // If we are in the recovery page, nuke all existing data
      if (flowTypeRecover) {
        // Destroy all accounts/settings/data
        await resetWalletConnectData();
        await resetAccountData();
        await resetSettingsData();
      }
      // We get the HDPath from 3 places: -AdvancedSettings, -DEFAULT_HD_PATH, -ParentAccountHdPath
      updateTempAccount({
        name,
        hdPath,
        ...(flowTypeSub && parentHdPath && { parentHdPath }),
        ...(flowTypeSub && parentMasterKey && { parentMasterKey }),
      });
      // Move to next step
      navigate(nextUrl);
    } else {
      setError(newError);
    }
  };

  const toggleShowAdvanced = () => {
    if (showAdvanced) {
      // Restore path to default
      setHdPath(defaultHdPath);
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
