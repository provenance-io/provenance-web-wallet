import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Typo as BaseTypo,
  Content,
  AdvancedSettings,
  Alert,
} from 'Components';
import { ICON_NAMES, DEFAULT_HD_PATH } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount, useActiveAccount, useSettings, useWalletConnect } from 'redux/hooks';

const Typo = styled(BaseTypo)`
  margin-bottom: 36px;
`;

interface Props {
  nextUrl: string;
  previousUrl: string;
  flowType: 'create' | 'add' | 'recover';
}

export const NewAccountName = ({ previousUrl, nextUrl, flowType }: Props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [HDPath, setHDPath] = useState(DEFAULT_HD_PATH);
  const navigate = useNavigate();
  const { updateTempAccount, accounts, resetAccountData } = useAccount();
  const { resetSettingsData } = useSettings();
  const { resetWalletConnectData } = useWalletConnect();
  const { accountLevel: parentAccountLevel, name: parentAccountName, hdPath: parentHdPath } = useActiveAccount();

  // const accountType: 'wallet' | 'account' = flowType === 'create' ? 'wallet' : 'account';
  const accountType: 'wallet' | 'account' = flowType === 'create' ? 'account' : 'account';

  const handleContinue = async () => {
    const validLength = name.length > 2 && name.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(name)
    let newError = '';
    if (!validCharacters) newError = 'Name must only contain alphanumeric characters.'
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.'
    if (!name) newError = `Please enter ${accountType === 'account' ? 'an account' : 'a wallet'} name.`;
    if (!newError) {
      // If we are in the recovery page, nuke all existing data
      if (flowType === 'recover') {
        // Reset all data in chrome storage and redux store
        await resetSettingsData();
        await resetWalletConnectData();
        await resetAccountData();
      }
      // We get the HDPath from 3 places: -AdvancedSettings, -DEFAULT_HD_PATH, -ParentAccountHdPath
      updateTempAccount({ name, hdPath: HDPath });
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
      <Button onClick={() => {navigate(previousUrl);}}>Back</Button>
  </>
  );
  const renderRecoverClearWarning = () => (
    <Alert type="warning" title="Warning">
      Continuing will remove all accounts and keys from this wallet. They cannot be recovered without a seed phase.
    </Alert>
  );

  // TODO: If the user closes this, we need to clear out the temp account information

  // If an 'addressIndex' is trying to add an account, don't let it -- not possible.
  const createAccountDisabled = (flowType === 'add' && parentAccountLevel === 'addressIndex');
  const recoverClearWallet = (flowType === 'recover' && !!accounts.length);

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title={`Name Your ${accountType}`} backLocation={previousUrl} />
      {createAccountDisabled ? renderAddressIndexError() : (
        <>
          {recoverClearWallet && renderRecoverClearWarning()}
          <Typo type="body">
            Name this {accountType} to easily identify it while using the Provenance Blockchain Wallet.
          </Typo>
          {flowType === 'add' && <Typo type="headline2">This is flowtype 'ADD'</Typo>}
          <Input
            id={`${accountType}Name`}
            label={`${accountType} Name`}
            placeholder={`Enter ${accountType} name`}
            value={name}
            onChange={setName}
            error={error}
          />
          <AdvancedSettings setResults={(newHDPath) => {setHDPath(newHDPath)}} parentHdPath={parentHdPath} />
          <Button onClick={handleContinue}>Continue</Button>
        </>
      )}
      
    </Content>
  );
};
