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
import { useAccount, useSettings, useWalletConnect } from 'redux/hooks';

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
      updateTempAccount({ name, hdPath: HDPath });
      // Move to next step
      navigate(nextUrl);
    }
    setError(newError);
  };

  // TODO: If the user closes this, we need to clear out the temp account information

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title={`Name Your ${accountType}`} backLocation={previousUrl} />
      {flowType === 'recover' && !!accounts.length && (
        <Alert type="warning" title="Warning">
          Continuing will remove all accounts and keys from this wallet. They cannot be recovered without a seed phase.
        </Alert>
      )}
      <Typo type="body">
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
      <AdvancedSettings setResults={(newHDPath) => {setHDPath(newHDPath)}} />
      <Button onClick={handleContinue}>Continue</Button>
    </Content>
  );
};
