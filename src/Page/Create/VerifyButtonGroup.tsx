import { useEffect, useState } from 'react';
import { css } from 'styled-components';
import { BodyContent, Button, Div } from 'Components';

interface Props {
  mnemonicArray: string[];
  setCorrect: (arg: boolean) => void;
  wordArr: string[];
}

export const VerifyButtonGroup = ({ mnemonicArray, setCorrect, wordArr }: Props) => {
  const [selected, setSelected] = useState('');
  const [answer, setAnswer] = useState({ word: '', ind: 0 });

  useEffect(() => {
    const word = wordArr[Math.floor(Math.random() * 3)];
    setAnswer({ word, ind: mnemonicArray.indexOf(word) + 1 });
  }, [mnemonicArray, wordArr]);

  useEffect(() => {
    setCorrect(selected === answer.word);
  }, [answer, selected, setCorrect]);

  return (
    <>
      <BodyContent
        $css={css`
          margin: 24px 0 16px;
          text-align: center;
        `}
      >
        select word #{answer.ind}
      </BodyContent>
      <Div
        $css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        `}
      >
        {wordArr?.map((w) => (
          <Button
            key={w}
            variant={selected === w ? 'secondary' : 'default'}
            onClick={() => setSelected(w)}
          >
            {w}
          </Button>
        ))}
      </Div>
    </>
  );
};
