import { useEffect, useState } from 'react';
import { BodyContent, Checkbox, Button, Header } from 'Components';
import { css } from 'styled-components';
import { VerifyButtonGroup } from './VerifyButtonGroup';
import { COLORS } from 'theme';
import {
  bytesToBase64,
  createMasterKeyFromMnemonic,
  createWalletFromMasterKey,
} from 'utils';
import { useWallet } from 'redux/hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  nextUrl: string;
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

export const VerifySeedphrase = ({ nextUrl }: Props) => {
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
  const { activeWalletIndex, wallets, updateWallet } = useWallet();
  const targetWallet = wallets[activeWalletIndex];
  const { mnemonic } = targetWallet;
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

  const handleContinue = () => {
    if (!termsAgree) {
      setErrorMsg('You must agree to the terms of your account passphrase.');
    } else if (correct.some((c) => !c)) {
      setErrorMsg('You selected incorrect choices. Please try again');
    } else {
      setErrorMsg('');
      if (mnemonic !== undefined) {
        const masterKey = createMasterKeyFromMnemonic(mnemonic);
        const { address, publicKey, privateKey } =
          createWalletFromMasterKey(masterKey);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        updateWallet({
          address,
          b64PrivateKey,
          b64PublicKey,
          walletIndex: activeWalletIndex,
        });
        navigate(nextUrl);
      }
    }
  };

  const createButtonGroups = () => {
    if (!verifyWords?.length) return null;

    return verifyWords?.map((wordArr, index) => {
      return (
        <VerifyButtonGroup
          key={wordArr.data.join('')}
          setCorrect={(correct) => handleCorrect(index, correct)}
          wordArr={wordArr}
        />
      );
    });
  };

  return (
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

      {createButtonGroups()}
      <Checkbox
        checked={termsAgree}
        onChange={(isChecked: boolean) => {
          setTermsAgree(isChecked);
        }}
        label="I agree that I'm solely responsible for my wallet, and cannot recover my account the passphrase is lost."
      />
      <Button onClick={handleContinue} variant="primary">
        Continue
      </Button>
    </>
  );
};
