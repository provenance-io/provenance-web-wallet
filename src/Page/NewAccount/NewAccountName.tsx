import { useState, useEffect } from 'react';
import {
  AdvancedSettings,
  Alert,
  BottomFloat,
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
}

export const NewAccountName = ({ nextUrl, flowType }: Props) => {
  // Shorthand flowtypes
  const flowTypeSub = flowType === 'sub';
  const flowTypeRecover = flowType === 'recover';
  const {
    accountLevel: parentAccountLevel,
    name: parentAccountName,
    hdPath: parentHdPath,
    masterKey: parentMasterKey,
  } = useActiveAccount();
  const defaultHdPath = flowTypeSub
    ? completeHdPath(parentHdPath!, "0'", true)
    : DEFAULT_MAINNET_HD_PATH;

  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [hdPath, setHdPath] = useState(defaultHdPath);
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const {
    updateTempAccount,
    accounts,
    resetAccountData,
    tempAccount,
    clearTempAccount,
  } = useAccount();
  const [name, setName] = useState(tempAccount?.name || '');
  const { resetSettingsData } = useSettings();
  const { resetWalletConnectData } = useWalletConnect();

  // Whenever this page loads, nuke existing tempAccount data
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      clearTempAccount();
    }
  }, [clearTempAccount, initialLoad]);

  const handleContinue = async () => {
    const validLength = name.length > 2 && name.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(name);
    let newError = '';
    if (!validCharacters)
      newError = 'Name must only contain alphanumeric characters.';
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.';
    if (!name) newError = 'Please enter an account name.';
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
      // Change the hash for the nextUrl
      window.location.hash = `#${nextUrl}`;
      // Move to next step
      navigate(nextUrl);
    } else {
      setError(newError);
    }
  };

  const renderAddressIndexError = () => (
    <>
      <Alert type="error" title="Error">
        Unable to create additional account with account "{parentAccountName}". "
        {parentAccountName}" is an "addressIndex" level account.
      </Alert>
      <BottomFloat>
        <Button
          onClick={() => {
            // Close the current tab
            chrome.tabs.getCurrent((tab) => {
              if (tab?.id) chrome.tabs.remove(tab.id);
            });
          }}
        >
          Close
        </Button>
      </BottomFloat>
    </>
  );

  const renderRecoverClearWarning = () => (
    <Alert type="warning" title="Warning">
      Continuing will remove all accounts and keys from this wallet. They cannot be
      recovered without a seed phase.
    </Alert>
  );

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

  // If an 'addressIndex' is trying to add an account, don't let it -- not possible.
  const createAccountDisabled = flowTypeSub && parentAccountLevel === 'addressIndex';
  const recoverClearWallet = flowTypeRecover && !!accounts.length;

  return (
    <FullPage title={flowType === 'add' ? 'Add New Account' : 'Create New Account'}>
      {createAccountDisabled ? (
        renderAddressIndexError()
      ) : (
        <>
          {recoverClearWallet && renderRecoverClearWarning()}
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
        </>
      )}
    </FullPage>
  );
};
