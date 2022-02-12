import { useEffect, useState } from 'react';
import {
  BodyContent,
  Button,
  Checkbox,
  CtaButton,
  Div,
  Header,
  P,
} from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { css } from 'styled-components';
import { VerifyButtonGroup } from './VerifyButtonGroup';
import { COLORS } from 'theme';

interface Props {
  nextUrl: string;
}

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

export const VerifyPassphrase = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const [correct, setCorrect] = useState<boolean[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifyWords, setVerifyWords] = useState<string[][] | null>(null);
  const mnemonic = useAppSelector((state) => state.app.mnemonic)?.split(' ');

  const handleCorrect = (ind: number, correct: boolean) => {
    setCorrect((arr) => {
      arr[ind] = correct;
      return arr;
    });
  };

  useEffect(() => {
    // if the mnemonic doesn't exist need to go back a page to generate a new one
    if (!mnemonic) {
      navigate(-1);
    }
  }, [mnemonic, navigate]);

  useEffect(() => {
    if (!verifyWords && mnemonic) {
      setVerifyWords(groupArrays(getRandomSubarray(mnemonic, mnemonic.length / 2)));
    }
  }, [mnemonic, verifyWords]);

  const handleContinue = () => {
    if (correct.some((c) => !c)) {
      setErrorMsg('You selected incorrect choices. Please try again');
      // } else if () {
    } else {
      setErrorMsg('');
    }
  };

  return mnemonic ? (
    <>
      <Header progress={66} title="Verify Passphrase" />

      {errorMsg && (
        <BodyContent
          $css={css`
            color: ${COLORS.NEGATIVE_200};
            text-align: center;
          `}
        >
          {errorMsg}
        </BodyContent>
      )}

      {verifyWords?.map((wordArr, ind) => (
        <VerifyButtonGroup
          key={wordArr.join('')}
          mnemonic={mnemonic}
          setCorrect={(correct) => handleCorrect(ind, correct)}
          wordArr={wordArr}
        />
      ))}

      <Checkbox
        id="agree"
        label="I agree that I'm solely responsible for my wallet, and cannot recover my account the passphrase is lost."
      />

      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </>
  ) : null;
};
