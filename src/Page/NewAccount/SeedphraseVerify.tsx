import { useEffect, useState } from 'react';
import { Checkbox as CheckboxBase, Button, FullPage, Typo } from 'Components';
import styled from 'styled-components';
import { useAccount } from 'redux/hooks';
import { useNavigate } from 'react-router-dom';
import { COLORS } from 'theme';
// import { APP_URL } from 'consts';
import { randomizeArray } from 'utils';

const Checkbox = styled(CheckboxBase)`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  padding-top: 20px;
  label {
    line-height: 1.5rem;
  }
  div {
    margin-top: 2px;
  }
`;
const AllWordRows = styled.div`
  background: ${COLORS.NEUTRAL_550};
  padding: 6px 10px 30px 10px;
  border-radius: 6px;
`;
const WordRow = styled.div`
  margin: 0 12px;
`;
const WordBtnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  width: 100%;
`;
const Bold = styled.span`
  font-weight: bold;
`;
const ContinueButton = styled(Button)`
  margin-top: 30px;
`;

interface Props {
  nextUrl: string;
}

export const SeedphraseVerify = ({ nextUrl }: Props) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [termsAgree, setTermsAgree] = useState(false);
  const [wordRows, setWordRows] = useState<
    { correctWord: string; correctWordIndex: number; allRowWords: string[] }[]
  >([]);
  // How many correct words (rows) should we make
  const correctCount = 4;
  // How many words should we show in a single row
  const rowWordCount = 3;
  // Navigate
  const navigate = useNavigate();
  // Redux Store
  const { tempAccount } = useAccount();
  // Pull mnemonic from tempAccount
  const mnemonic = (tempAccount && tempAccount?.mnemonic) || '';
  useEffect(() => {
    // Only run this if we haven't already created the wordArrays
    // Only run this once when we don't have wordRows or correctWords
    if (initialLoad) {
      setInitialLoad(false);
      // Turn mnemonic into array
      const mnemonicArray = mnemonic?.split(' ');
      // Shuffle mnemonic
      const mnemonicShuffled = randomizeArray(mnemonicArray);
      // Save incorrect words into their own array
      const incorrectWords = mnemonicShuffled.slice(
        correctCount,
        mnemonicShuffled.length
      );
      // Pull out first [correctCount] words
      const correctWordsArray = mnemonicShuffled.slice(0, correctCount);
      // If we haven't created the wordRows yet, create them
      setWordRows(
        correctWordsArray.map((correctWord, index) => {
          // Get the position of the correct word in the seed-phrase
          const correctWordIndex = mnemonicArray.indexOf(correctWord);
          // Incorrect words to grab
          const amount = rowWordCount - 1;
          // Incorrect index starting point
          const start = index * amount;
          // Incorrect index ending point
          const end = start + amount;
          // Grab however many incorrect words we want per row
          const allWordsOrdered = incorrectWords.slice(start, end);
          // Add back the correct word with the sample of incorrect words
          allWordsOrdered.push(correctWord);
          // Shuffle correct/incorrect words to randomize location of correct word within array
          const wordRowShuffled = randomizeArray(allWordsOrdered);

          return { correctWord, correctWordIndex, allRowWords: wordRowShuffled };
        })
      );
      // Update correctWords list in state
      setCorrectWords(correctWordsArray);
    }
  }, [correctWords, initialLoad, mnemonic]);

  // Check each selected word, make sure they are the correct words
  const validateSelections = () => {
    let valid = true;
    // Loop over correct words and make sure selected words match
    correctWords.forEach((word, index) => {
      // If the words don't match, not valid
      if (selectedWords[index] !== word) valid = false;
    });
    return valid;
  };

  // User selects a word from the list
  const handleWordSelect = (word: string, targetIndex: number) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords[targetIndex] = word;
    setSelectedWords(newSelectedWords);
  };

  const handleContinue = (event: React.MouseEvent) => {
    // Check if the selected are correct
    const correctSelections = validateSelections();
    // Pressing the shift + option keys will override any verification
    const verificationBypass = event.shiftKey && event.altKey;
    if (!verificationBypass && !termsAgree) {
      setErrorMsg('You must agree to the terms.');
    } else if (!verificationBypass && !correctSelections) {
      setErrorMsg('Incorrect choices selected.');
    } else {
      setErrorMsg('');
      // Change the hash for the nextUrl
      window.location.hash = `#${nextUrl}`;
      navigate(nextUrl);
    }
  };

  const renderWordRows = () =>
    wordRows.map(({ correctWordIndex, allRowWords }, rowIndex) => (
      <WordRow key={rowIndex}>
        <Typo type="body" marginBottom="10px" marginTop="20px">
          Select Word #{correctWordIndex + 1}
        </Typo>
        <WordBtnRow>
          {allRowWords.map((word) => (
            <Button
              key={word}
              variant={selectedWords[rowIndex] === word ? 'primary' : 'default'}
              onClick={() => handleWordSelect(word, rowIndex)}
            >
              {word}
            </Button>
          ))}
        </WordBtnRow>
      </WordRow>
    ));

  return (
    <FullPage title="Verify Seed Phrase">
      <Typo type="body" marginBottom="20px" align="left">
        Select the <Bold>{correctCount}</Bold> correct words from your seed phrase
      </Typo>
      <AllWordRows>{renderWordRows()}</AllWordRows>
      <Checkbox
        checked={termsAgree}
        labelClick={false}
        onChange={(isChecked: boolean) => {
          setTermsAgree(isChecked);
        }}
        label="I agree that I'm solely responsible for my wallet and cannot recover the seed phrase if lost."
      />
      {errorMsg && (
        <Typo type="error" align="left" marginTop="10px">
          {errorMsg}
        </Typo>
      )}
      <ContinueButton onClick={handleContinue} variant="primary">
        Continue
      </ContinueButton>
    </FullPage>
  );
};
