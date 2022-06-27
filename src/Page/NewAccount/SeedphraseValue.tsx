import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Typo,
  Button,
  Header,
  Content,
  BottomFloat,
} from 'Components';
import { COLORS } from 'theme';
import { useAccount } from 'redux/hooks';
import { createMnemonic } from 'utils';

const MnuemonicList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  padding: 20px 30px;
  height: 580px;
  border-radius: 4px;
  font-size: 1.4rem;
  background: ${COLORS.NEUTRAL_700};
`;
const ListItemNumber = styled.p`
  color: ${COLORS.NEUTRAL_250};
  display: inline-block;
  width: 1.4em;
  margin-right: 0.5em;
  text-align: left;
`;
const MnuemonicItem = styled.p`
  display: flex;
  justify-content: flex-start;
`;

interface Props {
  nextUrl: string;
  previousUrl: string;
  progress: number;
}

export const SeedphraseValue = ({ nextUrl, previousUrl, progress }: Props) => {
  const navigate = useNavigate();
  const { tempAccount, updateTempAccount } = useAccount();
  
  // On load, create the new mnemonic if it hasn't already been made
  useEffect(() => {
    // No mnemonic has been generated for this temporary account
    if (!tempAccount?.mnemonic) {
      // Create new mnemonic
      const mnemonic = createMnemonic();
      // Save mnemonic to the temporary account
      updateTempAccount({ mnemonic });
    }
  }, [updateTempAccount, tempAccount]);

  const handleContinue = () => {
    navigate(nextUrl);
  };

  return (
    <Content padBottom='80px'>
      <Header progress={progress} title="Recovery Seed Phrase" backLocation={previousUrl} />
      <Typo type="body">
        Make sure to record these words in the correct order, using the corresponding
        numbers.
      </Typo>
      {tempAccount?.mnemonic ? (
        <MnuemonicList>
        {tempAccount.mnemonic.split(' ').map((word, index) => (
          <MnuemonicItem key={index}>
            <ListItemNumber as="span">{index + 1}</ListItemNumber> {word}
          </MnuemonicItem>
        ))}
      </MnuemonicList>
      ) : 'Loading...'}
      <BottomFloat>
        <Button onClick={handleContinue}>Continue</Button>
      </BottomFloat>
    </Content>
  );
};
