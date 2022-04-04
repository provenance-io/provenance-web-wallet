import { Header, Button, InfoText, Input } from 'Components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ICON_NAMES } from 'consts';

const Group = styled.div`
  flex-grow: 1;
  text-align: center;
`;
const InputGroup = styled.div`
  text-align: left;
`;

export const RecoverAccountName:React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Group>
        <Header title="Name Your Account" progress={33} iconLeft={ICON_NAMES.CLOSE} />
        <InfoText margin="16px auto 0 auto" font="PRIMARY">
          Name your acount to easily identify it while using the Figure Tech Wallet.
        </InfoText>
        <InfoText margin="16px auto 32px auto" font="PRIMARY">
          These names are stored locally, and can only be seen by you.
        </InfoText>
        <InputGroup>
          <Input label="Account Name" id="account-name" placeholder='Account Name' />
        </InputGroup>
      </Group>
      <Button variant='primary' onClick={() => navigate('../note')}>Continue</Button>
    </>
  );
};
