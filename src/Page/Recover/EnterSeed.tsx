import styled from 'styled-components';
import { useState } from 'react';
import { Button, Header, Input } from 'Components';

const Wrapper = styled.div`
  padding: 30px 16px 48px 16px;
  text-align: center;
`;
const InputSection = styled.div`
  text-align: left;
  margin-top: 40px;
  margin-bottom: 70px;
  input {
    margin-bottom: 32px;
  }
`;

export const EnterSeed:React.FC = () => {
  const totalSeeds = 24;
  const [inputValues, setInputValues] = useState<string[]>([]);

  const updateInput = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const createSeedInputs = (total: number) => {
    const allInputs = [];

    const onInputChange = (i: number, e: any) => { updateInput(i, e.target.value)}

    for (let i = 0; i < total; i += 1) {
      const displayNum = i + 1;
      allInputs.push(
        <Input
          id={`${displayNum}`}
          label={`Passphrase ${displayNum}`}
          key={`Passphrase ${displayNum}`}
          value={inputValues[i]}
          onChange={(e: any) => onInputChange(i, e)}
        />
      );
    }
    return allInputs;
  };

  return (
    <Wrapper>
      <Header title="Enter Recovery Passphrase"  progress={50} />
      <InputSection>
        {createSeedInputs(totalSeeds)}
      </InputSection>
      <Button variant='primary'>Continue</Button>
    </Wrapper>
  );
};
