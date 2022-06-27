import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Typo,
  Content,
  AdvancedSettings,
  Alert,
  BottomFloat,
} from 'Components';
import { ICON_NAMES, DEFAULT_MAINNET_HD_PATH } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount, useActiveAccount, useSettings, useWalletConnect } from 'redux/hooks';
import { completeHdPath } from 'utils';

interface StyledProps {
  enabled?: boolean,
}

const AdvancedTextButton = styled.div<StyledProps>`
  color: ${({ enabled }) => enabled ? '#357EFD' : '#AAAAAA' };
  font-weight: bold;
  margin: 20px 0;
  cursor: pointer;
  user-select: none;
`;

interface Props {
  nextUrl: string;
  previousUrl: string;
  flowType: 'create' | 'add' | 'recover';
  progress: number;
}

export const NewAccountName = ({ previousUrl, nextUrl, flowType, progress }: Props) => {
  // Shorthand flowtypes
  const flowTypeAdd = flowType === 'add';
  const flowTypeRecover = flowType === 'recover';
  const flowTypeCreate = flowType === 'create';
  const { accountLevel: parentAccountLevel, name: parentAccountName, hdPath: parentHdPath, masterKey: parentMasterKey } = useActiveAccount();
  // When we are adding an account, we need to write the HD path all the way down to addressIndex and account for the parent path
  // TODO: completeHdPath can set a custom addressIndex, determine if an addressIndex already exists (loop through all accounts) and auto increment that value by 1 as needed.
  const defaultHdPath = flowTypeAdd ? completeHdPath(parentHdPath!, "0'", true) : DEFAULT_MAINNET_HD_PATH;

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [hdPath, setHdPath] = useState(defaultHdPath);
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const { updateTempAccount, accounts, resetAccountData } = useAccount();
  const { resetSettingsData } = useSettings();
  const { resetWalletConnectData } = useWalletConnect();
  // const accountType: 'wallet' | 'account' = flowType === 'create' ? 'wallet' : 'account';
  const accountType: 'wallet' | 'account' = flowTypeCreate ? 'account' : 'account';

  const handleContinue = async () => {
    const validLength = name.length > 2 && name.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(name)
    let newError = '';
    if (!validCharacters) newError = 'Name must only contain alphanumeric characters.'
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.'
    if (!name) newError = `Please enter ${accountType === 'account' ? 'an account' : 'a wallet'} name.`;
    if (!newError) {
      // If we are in the recovery page, nuke all existing data
      if (flowTypeRecover) {
        // Reset all data in chrome storage and redux store
        await resetSettingsData();
        await resetWalletConnectData();
        await resetAccountData();
      }
      // We get the HDPath from 3 places: -AdvancedSettings, -DEFAULT_HD_PATH, -ParentAccountHdPath
      updateTempAccount({
        name,
        hdPath,
        ...((flowTypeAdd && parentHdPath) && { parentHdPath }),
        ...((flowTypeAdd && parentMasterKey) && { parentMasterKey })
      });
      // Move to next step
      navigate(nextUrl);
    }
    setError(newError);
  };

  const renderAddressIndexError = () => (
    <>
      <Alert type="error" title="Error">
        Unable to create additional account with account "{parentAccountName}". "{parentAccountName}" is an "addressIndex" level account.
      </Alert>
      <BottomFloat>
        <Button onClick={() => {navigate(previousUrl);}}>Back</Button>
      </BottomFloat>
  </>
  );
  const renderRecoverClearWarning = () => (
    <Alert type="warning" title="Warning">
      Continuing will remove all accounts and keys from this wallet. They cannot be recovered without a seed phase.
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
  }

  // TODO: If the user closes this, we need to clear out the temp account information

  // If an 'addressIndex' is trying to add an account, don't let it -- not possible.
  const createAccountDisabled = (flowTypeAdd && parentAccountLevel === 'addressIndex');
  const recoverClearWallet = (flowTypeRecover && !!accounts.length);

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={progress} title={`Name Your ${accountType}`} backLocation={previousUrl} />
      {createAccountDisabled ? renderAddressIndexError() : (
        <>
          {recoverClearWallet && renderRecoverClearWarning()}
          <Typo type="body" marginBottom="36px">
            Name this {accountType} to easily identify it while using the Provenance Blockchain Wallet.
          </Typo>
          <Input
            id={`${accountType}Name`}
            label={`${accountType} Name`}
            placeholder={`Enter ${accountType} name`}
            value={name}
            onChange={setName}
            error={error}
          />
          <AdvancedTextButton enabled={showAdvanced} onClick={toggleShowAdvanced}>Advanced Settings ({showAdvanced ? 'Enabled' : 'Disabled'})</AdvancedTextButton>
          {showAdvanced && <AdvancedSettings
            setResults={(newHdPath) => {setHdPath(newHdPath)}}
            parentHdPath={flowTypeAdd ? parentHdPath : undefined}
            setContinueDisabled={setContinueDisabled}
          />
          }
          <BottomFloat>
            <Button onClick={handleContinue} disabled={continueDisabled} title={`${continueDisabled ? 'Required HD Path value missing' : ''}`}>Continue</Button>
          </BottomFloat>
        </>
      )}
    </Content>
  );
};
