import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  Header,
  Input,
  Content,
  BottomFloat,
  Typo,
  ScrollContainer,
} from 'Components';
import { isMnemonic, validateMnemonic, keyPress, cleanMnemonic } from 'utils';
import { useAccount } from 'redux/hooks';
import { MNEMONIC_WORD_COUNT } from 'consts';

const InputSection = styled.div`
  text-align: left;
  margin-right: 20px;
  input {
    margin-bottom: 32px;
  }
`;

interface InputData {
  error?: string;
  value?: string;
}
interface Props {
  nextUrl: string;
  previousUrl: string;
  progress: number;
}

export const SeedphraseInputTab: React.FC<Props> = ({
  nextUrl,
  previousUrl,
  progress,
}) => {
  const navigate = useNavigate();
  const { updateTempAccount } = useAccount();
  const [inputValues, setInputValues] = useState<InputData[]>(
    Array.from({ length: MNEMONIC_WORD_COUNT }, () => ({ value: '', error: '' }))
  );
  const [submitError, setSubmitError] = useState<string>('');

  const updateInput = (index: number, value: string) => {
    // Clone all inputValues
    const newInputValues = [...inputValues];
    // Check to see if the value entered is an entire pasted mnemonic
    const cleanedMnemonicArray = cleanMnemonic(value);
    // After cleaning, check the length
    const wholeMnemonic = cleanedMnemonicArray.length === MNEMONIC_WORD_COUNT;
    // Entire mnemonic was pasted in
    if (wholeMnemonic) {
      // Loop through each input and change the value to match the pasted mnemonic
      cleanedMnemonicArray.forEach((word, index) => {
        newInputValues[index].value = word;
        newInputValues[index].error = isMnemonic(word) ? '' : 'Invalid Word';
      });
    } else {
      // Only single value (or non-mnemonic entered)
      newInputValues[index].value = value;
      newInputValues[index].error = isMnemonic(value) ? '' : 'Invalid Word';
    }
    // Update target inputValue
    setInputValues(newInputValues);
  };

  const createSeedInputs = () =>
    inputValues.map(({ value, error }, index) => {
      const displayNum = index + 1;
      return (
        <Input
          id={`${displayNum}`}
          label={`Word ${displayNum}`}
          key={`Word ${displayNum}`}
          value={value}
          onChange={(newValue: string) => updateInput(index, newValue)}
          error={error}
          onKeyPress={(e) => keyPress(e, handleContinue)}
          // Autofocus the first input on pageload
          {...(index === 0 && { autoFocus: true })}
        />
      );
    });

  // Make sure all inputs have a value and are error-free
  const allInputsValid = () =>
    inputValues.filter((input) => input.value && !input.error).length ===
    MNEMONIC_WORD_COUNT;

  const handleContinue = () => {
    // Clear out previous error
    setSubmitError('');
    if (allInputsValid()) {
      // Combine all inputs into single string mnemonic (with spaces)
      const mnemonic = inputValues.map(({ value }) => value).join(' ');
      // Validate mnemonic
      const validMnemonic = validateMnemonic(mnemonic);
      if (validMnemonic) {
        // Add mnemonic into the temp wallet
        updateTempAccount({ mnemonic });
        navigate(nextUrl);
      } else {
        setSubmitError('Invalid Mnemonic Entered');
      }
    }
    // If any error, show error message
    else setSubmitError('Please fix input issues above');
  };

  return (
    <Content>
      <Header
        title="Enter Recovery Seedphrase"
        progress={progress}
        backLocation={previousUrl}
      />
      <ScrollContainer height="400px">
        <InputSection>{createSeedInputs()}</InputSection>
      </ScrollContainer>
      {submitError && (
        <Typo type="error" marginTop="20px">
          {submitError}
        </Typo>
      )}
      <BottomFloat>
        <Button onClick={handleContinue} disabled={!allInputsValid()}>
          Continue
        </Button>
      </BottomFloat>
    </Content>
  );
};
