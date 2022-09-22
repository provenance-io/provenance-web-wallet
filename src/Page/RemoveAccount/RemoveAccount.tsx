import {
  Header,
  Input,
  Alert,
  Button,
  Typo,
  BottomFloat,
  Content,
} from 'Components';
import { DASHBOARD_MENU_URL, ICON_NAMES } from 'consts';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAccount } from 'redux/hooks';
import styled from 'styled-components';
import { COLORS } from 'theme';
import type { Account } from 'types';
import { decryptKey, keyPress } from 'utils';

const StyledAddress = styled.div`
  color: ${COLORS.NEUTRAL_150};
  font-weight: bold;
  font-size: 1.2rem;
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  background: ${COLORS.NEUTRAL_550};
  padding: 10px;
  border-radius: 3px;
`;
const InputSection = styled.div`
  width: 100%;
  input {
    margin-bottom: 20px;
  }
`;

export const RemoveAccount: React.FC = () => {
  const [confirmAddress, setConfirmAddress] = useState('');
  const [walletPassword, setWalletPassword] = useState('');
  const [inputErrors, setInputErrors] = useState<string[]>([]); // [confirmAddress, walletPassword]
  const navigate = useNavigate();
  const { address: removeAddress } = useParams();
  const { removeAccount, accounts } = useAccount();
  const { name, masterKey } =
    accounts.find((account: Account) => account.address! === removeAddress) || {};

  const validateInputFields = () => {
    const newErrors = [];
    const validLast4 = removeAddress!.slice(-4);
    if (validLast4 !== confirmAddress)
      newErrors[0] = 'Invalid account address values entered.';
    const masterKeyB64 = decryptKey(masterKey!, walletPassword);
    if (!masterKeyB64) newErrors[1] = 'Invalid wallet password';
    // Savbe new errors to state
    setInputErrors(newErrors);
    return !newErrors.length; // No errors length means success
  };

  const handleRemoveAccount = () => {
    if (validateInputFields()) {
      removeAccount(removeAddress!);
      navigate(DASHBOARD_MENU_URL);
    }
  };

  const handleInputChange = (
    value: string,
    errorIndex: number,
    type: 'wallet' | 'address'
  ) => {
    // clear any errors out
    const updatedErrors = [...inputErrors];
    updatedErrors[errorIndex] = '';
    setInputErrors(updatedErrors);
    type === 'address' ? setConfirmAddress(value) : setWalletPassword(value);
  };

  return (
    <Content>
      <Header
        title="Remove Account"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={DASHBOARD_MENU_URL}
      />
      <StyledAddress>{removeAddress}</StyledAddress>
      <Alert type="warning" title="Warning">
        Without its seed phase, account "{name}" cannot be recovered.
      </Alert>
      <Typo type="headline2" align="left" marginTop="20px" marginBottom="20px">
        Confirm Removal
      </Typo>
      <InputSection>
        <Input
          id="confirmAddress"
          value={confirmAddress}
          onChange={(value) => handleInputChange(value, 0, 'address')}
          placeholder="Last 4 address characters"
          label="Last 4 Address Characters"
          error={inputErrors[0]}
        />
        <Input
          id="walletPassword"
          value={walletPassword}
          onChange={(value) => handleInputChange(value, 1, 'wallet')}
          placeholder="Wallet password"
          label="Wallet Password"
          error={inputErrors[1]}
          type="password"
          onKeyPress={(e) => keyPress(e, handleRemoveAccount)}
        />
      </InputSection>
      <BottomFloat>
        <Button onClick={handleRemoveAccount}>Remove Account</Button>
      </BottomFloat>
    </Content>
  );
};
