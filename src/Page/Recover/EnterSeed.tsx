import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Header, Input } from 'Components';
import { isMnumonic, validateMnemonic } from 'utils';
import { useWallet } from 'redux/hooks';

const Wrapper = styled.div`
  width: 100%;
`;

const InputSection = styled.div`
  text-align: left;
  margin-top: 40px;
  margin-bottom: 70px;
  input {
    margin-bottom: 32px;
  }
`;
const ErrorMessage = styled.div`
  color: #E63740;
  font-weight: bold;
  margin-bottom: 20px;
`;

interface InputData {
  id: number,
  error?: string,
  value?: string,
};
interface Props {
  nextUrl: string,
}

export const EnterSeed:React.FC<Props> = ({ nextUrl }) => {
  const totalSeeds = 24;
  const navigate = useNavigate();
  const { updateTempWallet } = useWallet();
  const createInitialInputData = () => {
    // Clone all inputValues
    const newInputValues = [];
    // Add data
    for (let i = 0; i < totalSeeds; i += 1) {
      const data = {
        value: '',
        id: i,
        error: '',
      }
      // Update target inputValue
      newInputValues[i] = data;
    }
    return newInputValues;
  };
  const [inputValues, setInputValues] = useState<InputData[]>(createInitialInputData());
  const [submitError, setSubmitError] = useState<string>('');

  const updateInput = (index: number, field: 'error' | 'value', value: string) => {
    // Clone all inputValues
    const newInputValues = [...inputValues];
    // Update target inputValue
    if (index !== undefined && field) {
      // Remove any previous errors
      newInputValues[index].error = '';
      newInputValues[index][field] = value;
      setInputValues(newInputValues);
    }
  };

  const validateInputs = () => {
    let valid = true;
    // Loop through and check existance and type
    inputValues.forEach((data, index) => {
      const { value } = data;
      // Must be string A-Z only
      if (value && !(/^[a-zA-Z]+$/.test(value))) {
        valid = false;
        // Set input error
        updateInput(index, 'error', 'Must be string');
      }
      // Must have value
      if (value === undefined || value === null || value === '') {
        valid = false;
        // Set input error
        updateInput(index, 'error', 'Required');
      }
    });
    return valid;
  };

  const createSeedInputs = (total: number) => {
    const allInputsElements = [];

    const onInputChange = (i: number, value: any) => {
      // Check to see if the value entered is an entire pasted mnumonic
      const wholeMnumonic = isMnumonic(value, totalSeeds);
      if (wholeMnumonic) {
        // Loop through each input and change the value to match the pasted mnumonic
        wholeMnumonic.forEach((word, index) => {
          updateInput(index, 'value', word);
        });
      } else updateInput(i, 'value', value);
    }

    for (let i = 0; i < total; i += 1) {
      const displayNum = i + 1;
      const { value, error } = inputValues[i];
      allInputsElements.push(
        <Input
          id={`${displayNum}`}
          label={`Passphrase ${displayNum}`}
          key={`Passphrase ${displayNum}`}
          value={value}
          onChange={(value: any) => onInputChange(i, value)}
          error={error}
        />
      );
    }
    return allInputsElements;
  };

  const handleContinue = () => {
    // Clear out previous error
    setSubmitError('');
    // Validate all inputs first
    const validInputs = validateInputs();
    // If there are no errors, go to the next page
    if (validInputs) {
      // Grab all input values
      const mnemonic = inputValues.map(({ value }) => value).join(' ');
      // Validate mnemonic
      const validMnemonic = validateMnemonic(mnemonic);
      if (validMnemonic) {
        // Add mnemonic into the temp wallet
        updateTempWallet({ mnemonic });
        navigate(nextUrl);
      } else {
        setSubmitError('Invalid Mnemonic');
      }

    }
    // If any error, show error message
    else setSubmitError('Please fix input issues above');
  };

  const filledOutInputs = inputValues.filter(({ value }) => !!value).length;
  const allFilledOut = filledOutInputs === totalSeeds;

  return (
    <Wrapper>
      <Header title="Enter Recovery Passphrase" progress={100} />
      <InputSection>
        {createSeedInputs(totalSeeds)}
      </InputSection>
      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
      <Button onClick={handleContinue} disabled={!allFilledOut}>Continue</Button>
    </Wrapper>
  );
};
