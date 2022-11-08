import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Typo,
  Button as ButtonBase,
  FullPage,
  ScrollContainer,
  CopyValue,
  Sprite,
} from 'Components';
import { COLORS } from 'theme';
import { useAccount } from 'redux/hooks';
import { createMnemonic } from 'utils';
import { ICON_NAMES } from 'consts';

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
  background: ${COLORS.NEUTRAL_600};
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
const Button = styled(ButtonBase)`
  margin-top: 30px;
`;

interface Props {
  nextUrl: string;
}

export const SeedphraseValueTab = ({ nextUrl }: Props) => {
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
    // Change the hash for the nextUrl
    window.location.hash = `#${nextUrl}`;
    navigate(nextUrl);
  };

  return (
    <FullPage title="Recovery Seed Phrase">
      <Typo type="body" marginBottom="20px" align="left">
        Make sure to record these words in the correct order, using the corresponding
        numbers.
      </Typo>
      <CopyValue value={tempAccount?.mnemonic}>
        <Typo type="bodyAlt" marginBottom="10px">
          Copy Seed&nbsp;
          <Sprite icon={ICON_NAMES.COPY} size="1.2rem" />
        </Typo>
      </CopyValue>
      {tempAccount?.mnemonic ? (
        <ScrollContainer height="308px" paddingBottom="0">
          <MnuemonicList>
            {tempAccount.mnemonic.split(' ').map((word, index) => (
              <MnuemonicItem key={index}>
                <ListItemNumber as="span">{index + 1}</ListItemNumber> {word}
              </MnuemonicItem>
            ))}
          </MnuemonicList>
        </ScrollContainer>
      ) : (
        'Loading...'
      )}
      <Button onClick={handleContinue}>Continue</Button>
    </FullPage>
  );
};
