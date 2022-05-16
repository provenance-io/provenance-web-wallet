import { useState } from 'react';
import {
  BodyContent,
  Button,
  Header,
  Input,
  Select as SelectBase,
  Content,
} from 'Components';
import { APP_URL, ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'redux/hooks';
import { createMnemonic } from 'utils';

const Select = styled(SelectBase)`
  margin-top: 10px;
`;
const AdvancedMessage = styled.div<{active: boolean}>`
  font-size: 1.6rem;
  font-weight: bold;
  margin-top: 80px;
  cursor: pointer;
  color: ${({ active }) => active ? '#357EFD' : '#FFFFFF' };
  user-select: none;
`;

interface Props {
  nextUrl: string;
}

export const CreateStart = ({ nextUrl }: Props) => {
  const defaultNetwork = 'mainnet';
  const navigate = useNavigate();
  const { updateTempAccount } = useAccount();
  const [name, setName] = useState('');
  const [network, setNetwork] = useState(defaultNetwork);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const mnemonic = createMnemonic();

  const handleContinue = () => {
    if (name) {
      updateTempAccount({ name, mnemonic, network });
      // Move to next step
      navigate(nextUrl);
    }
  };

  const toggleAdvancedSettings = () => {
    if (showAdvanced) setNetwork(defaultNetwork);
    setShowAdvanced(!showAdvanced)
  };

  return (
    <Content>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Name Your Account" backLocation={APP_URL} />
      <BodyContent
        $css={css`
          text-align: center;
          margin-bottom: 32px;
        `}
      >
        Name your acount to easily identify it while using the Figure Tech Wallet. These names are
        stored locally, and can only be seen by you.
      </BodyContent>
      <Input id="account-name" label="Account Name" type="text" placeholder="Account Name" value={name} onChange={setName} />
      <AdvancedMessage
        active={showAdvanced}
        onClick={toggleAdvancedSettings}
      >
        Advanced Settings ({`${showAdvanced ? 'On' : 'Off'}`})
      </AdvancedMessage>
      {showAdvanced && <Select label="Network" options={['mainnet', 'testnet']} value={network} onChange={setNetwork} />}
      <Button onClick={handleContinue} >Continue</Button>
    </Content>
  );
};
