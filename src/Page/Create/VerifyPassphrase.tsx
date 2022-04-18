import { useEffect, useState } from 'react';
import { BodyContent, Checkbox, CtaButton, Header } from 'Components';
import { css } from 'styled-components';
import { VerifyButtonGroup } from './VerifyButtonGroup';
import { walletActions } from 'redux/features/wallet/walletSlice';
import { COLORS } from 'theme';
import { RootState } from 'redux/store';
import { bytesToBase64, createMasterKeyFromMnemonic, createWalletFromMasterKey } from 'utils';
import { useDispatch, useSelector } from 'react-redux';

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

export const VerifyPassphrase = ({ nextUrl }: Props) => {
  const [correct, setCorrect] = useState<boolean[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifyWords, setVerifyWords] = useState<string[][] | null>(null);
  // Redux Store
  const { activeWalletIndex, wallets } = useSelector((state: RootState) => state.wallet);
  const { updateWallet } = walletActions;
  const dispatch = useDispatch();
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
      setVerifyWords(groupArrays(getRandomSubarray(mnemonicArray, mnemonicArray.length / 2)));
    }
  }, [mnemonicArray, verifyWords, mnemonic]);

  const handleContinue = () => {
    if (correct.some((c) => !c)) {
      setErrorMsg('You selected incorrect choices. Please try again');
    } else {
      setErrorMsg('');
      if (mnemonic !== undefined) {
        const masterKey = createMasterKeyFromMnemonic(mnemonic);
        const { address, publicKey, privateKey } = createWalletFromMasterKey(masterKey);
        const b64PublicKey = bytesToBase64(publicKey);
        const b64PrivateKey = bytesToBase64(privateKey);
        dispatch(updateWallet({ address, b64PrivateKey, b64PublicKey, walletIndex: activeWalletIndex }))
      }
    }
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

      {mnemonic && mnemonicArray?.length && verifyWords?.map((wordArr, ind) => (
        <VerifyButtonGroup
          key={wordArr.join('')}
          mnemonic={mnemonicArray}
          setCorrect={(correct) => handleCorrect(ind, correct)}
          wordArr={wordArr}
        />
      ))}

      <Checkbox
        id="agree"
        label="I agree that I'm solely responsible for my wallet, and cannot recover my account the passphrase is lost."
        onChange={() => {
          console.log('CHECKBOX IN VERIFYPASSPHRASE NEEDS TO HANDLE A CHANGE');
        }}
      />

      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </>
  );
};
