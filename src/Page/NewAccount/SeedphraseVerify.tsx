import { useEffect, useState } from 'react';
import {
  Checkbox as CheckboxBase,
  Button,
  Header,
  Content,
  Typo,
  BottomFloat,
} from 'Components';
import styled from 'styled-components';
import { SeedphraseVerifyGroup } from './SeedphraseVerifyGroup';
import { useAccount } from 'redux/hooks';
import { useNavigate } from 'react-router-dom';

const Checkbox = styled(CheckboxBase)`
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
`;

interface Props {
  nextUrl: string;
  previousUrl: string;
  progress: number;
}

// TODO: Would like to rewrite this functino... straight copied it from stack overflow
const getRandomSubarray = (arr: string[] = [], size: number = 0) => {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - size,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
};

const groupArrays = (arr: string[] = [], size: number = 3) =>
  arr.reduce((acc: string[][], curr: string, ind: number) => {
    if (ind % size === 0) {
      return [[curr], ...acc];
    } else {
      const [group, ...rest] = acc;
      return [[...group, curr], ...rest];
    }
  }, []);

export const SeedphraseVerify = ({ nextUrl, previousUrl, progress }: Props) => {
  const [correct, setCorrect] = useState<boolean[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [termsAgree, setTermsAgree] = useState(false);
  const [verifyWords, setVerifyWords] = useState<Array<{
    data: string[];
    index: number;
  }> | null>(null);
  // Navigate
  const navigate = useNavigate();
  // Redux Store
  const { tempAccount } = useAccount();
  const mnemonic = (tempAccount && tempAccount?.mnemonic) || '';
  const mnemonicArray = mnemonic?.split(' ');

  const handleCorrect = (ind: number, correct: boolean) => {
    setCorrect((arr) => {
      arr[ind] = correct;
      return arr;
    });
  };

  useEffect(() => {
    if (!verifyWords && mnemonic && mnemonicArray) {
      const subArraySize = mnemonicArray.length / 2;
      const groupedArraySize = 3;
      const groupedArrays = groupArrays(
        getRandomSubarray(mnemonicArray, subArraySize),
        groupedArraySize
      );
      setVerifyWords(
        groupedArrays.map((arr) => ({
          data: arr,
          index: Math.floor(Math.random() * groupedArraySize),
        }))
      );
    }
  }, [mnemonicArray, verifyWords, mnemonic]);

  const handleContinue = (event:React.MouseEvent) => {
    // Pressing the shift + option keys will override any verification
    const verificationBypass = event.shiftKey && event.altKey;
    if (!verificationBypass && !termsAgree) {
      setErrorMsg('You must agree to the terms of your account passphrase.');
    } else if (!verificationBypass && correct.some((c) => !c)) {
      setErrorMsg('You selected incorrect choices. Please try again');
    } else {
      setErrorMsg('');
      if (mnemonic !== undefined) {
        navigate(nextUrl);
      }
    }
  };

  const createButtonGroups = () => {
    if (!mnemonicArray?.length) return null;

    return verifyWords?.map((wordArr, index) => {
      return (
        <SeedphraseVerifyGroup
          key={wordArr.data.join('')}
          mnemonicArray={mnemonicArray}
          setCorrect={(correct) => handleCorrect(index, correct)}
          wordArr={wordArr}
        />
      );
    });
  };

  return (
    <Content padBottom='120px'>
      <Header progress={progress} title="Verify Passphrase" backLocation={previousUrl} />
      {createButtonGroups()}
      <Checkbox
        checked={termsAgree}
        onChange={(isChecked: boolean) => {
          setTermsAgree(isChecked);
        }}
        label="I agree that I'm solely responsible for my wallet and cannot recover the passphrase if lost."
      />
      {errorMsg && (
        <Typo type='error'>{errorMsg}</Typo>
      )}
      <BottomFloat>
        <Button onClick={handleContinue} variant="primary">Continue</Button>
      </BottomFloat>
    </Content>
  );
};
