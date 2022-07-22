import { Header, Input, Button, BottomFloat } from 'Components';
import { DASHBOARD_MENU_URL, ICON_NAMES } from 'consts';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAccount } from 'redux/hooks';
import styled from 'styled-components';

const InputSection = styled.div`
  width: 100%;
  input {
    margin-bottom: 20px;
  }
`;
const StyledAddress = styled.div`
  color: rgb(217 217 217);
  font-weight: bold;
  font-size: 1.2rem;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  background: rgb(72 73 73);
  padding: 10px;
  border-radius: 3px;
`;

export const RenameAccount: React.FC = () => {
  const { renameAccount } = useAccount();
  const { address: renameAddress } = useParams();
  const [newName, setNewName] = useState('');
  const [inputError, setInputError] = useState<string>('');
  const navigate = useNavigate();

  const validateInputField = () => {
    const validLength = newName.length > 2 && newName.length < 16;
    const validCharacters = /^([a-zA-Z0-9-_]+\s)*[a-zA-Z0-9-_]+$/.test(newName);
    let newError = '';
    if (!validCharacters)
      newError = 'Name must only contain alphanumeric characters.';
    if (!validLength) newError = 'Name must be 3 to 15 alphanumeric characters.';
    if (!newName) newError = 'Enter an account name.';
    // Save new errors to state
    setInputError(newError);
    return !newError;
  };

  const submitAccountRename = () => {
    if (validateInputField()) {
      renameAccount({ address: renameAddress!, name: newName! });
      navigate(DASHBOARD_MENU_URL);
    }
  };

  const handleInputChange = (value: string) => {
    setInputError('');
    setNewName(value);
  };

  return (
    <>
      <Header
        title="Rename Account"
        iconLeft={ICON_NAMES.CLOSE}
        backLocation={DASHBOARD_MENU_URL}
      />
      <StyledAddress>{renameAddress}</StyledAddress>
      <InputSection>
        <Input
          id="renameAccount"
          value={newName}
          onChange={handleInputChange}
          placeholder="Account Name"
          label="Enter New Account Name"
          error={inputError}
          autoFocus
        />
      </InputSection>
      <BottomFloat>
        <Button onClick={submitAccountRename}>Rename Account</Button>
      </BottomFloat>
    </>
  );
};
