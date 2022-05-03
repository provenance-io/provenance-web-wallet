import { useState } from 'react';
import { Header, Button, InfoText, Input } from 'Components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ICON_NAMES } from 'consts';
import { useAccount } from 'redux/hooks';

const Group = styled.div`
  flex-grow: 1;
  text-align: center;
`;
const InputGroup = styled.div`
  text-align: left;
`;

interface Props {
  nextUrl: string,
}

export const RecoverAccountName:React.FC<Props> = ({ nextUrl }) => {
  const [ name, setName ] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updatetempAccount } = useAccount();

  const handleContinue = () => {
    let newError = '';
    if (!name) newError = 'Wallet name is required';
    if (!/^[-\w\s]+$/.test(name)) newError = 'Wallet name must be alphanumeric';
    if (!newError) {
      // Update the tempAccount to use this account name
      updatetempAccount({ name });
      navigate(nextUrl)
    }
    setError(newError);
  };

  return (
    <>
      <Group>
        <Header title="Name Your Account" progress={33} iconLeft={ICON_NAMES.CLOSE} />
        <InfoText margin="16px auto 0 auto" font="PRIMARY">
          Name your account to easily identify it while using Provenance Wallet.
        </InfoText>
        <InfoText margin="16px auto 32px auto" font="PRIMARY">
          These names are stored locally, and can only be seen by you.
        </InfoText>
        <InputGroup>
          <Input
            label="Account Name"
            id="wallet-name"
            placeholder='Enter name'
            value={name}
            onChange={setName}
            error={error}
            />
        </InputGroup>
      </Group>
      <Button onClick={handleContinue}>Continue</Button>
    </>
  );
};
