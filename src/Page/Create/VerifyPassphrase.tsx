import { useEffect, useState } from 'react';
import { Button, CtaButton, Div, Header } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { css } from 'styled-components';

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

export const VerifyPassphrase = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const [verifyWords, setVerifyWords] = useState<string[] | null>(null);
  const mnemonic = useAppSelector((state) => state.app.mnemonic)?.split(' ');

  useEffect(() => {
    // if the mnemonic doesn't exist need to go back a page to generate a new one
    if (!mnemonic) {
      navigate(-1);
    }
  }, [mnemonic, navigate]);

  useEffect(() => {
    if (!verifyWords && mnemonic) {
      setVerifyWords(getRandomSubarray(mnemonic, mnemonic.length / 2));
    }
  }, [mnemonic, verifyWords]);

  return (
    <>
      <Header progress={66} title="Verify Passphrase" />
      <Div
        $css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        `}
      >
        {verifyWords?.map((w) => (
          <Button key={w}>{w}</Button>
        ))}
      </Div>
      <CtaButton onClick={() => navigate(nextUrl)}>Continue</CtaButton>
    </>
  );
};
