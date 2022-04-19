import { useEffect, useState } from 'react';
import { css } from 'styled-components';
import { BodyContent, Button, Div } from 'Components';

interface Props {
  mnemonicArray: string[];
  setCorrect: (arg: boolean) => void;
  wordArr: {
    data: string[];
    index: number;
  };
}

export const VerifyButtonGroup = ({ mnemonicArray, setCorrect, wordArr }: Props) => {
  const [selected, setSelected] = useState('');
  const [answer] = useState({
    word: wordArr.data[wordArr.index],
    index: mnemonicArray.indexOf(wordArr.data[wordArr.index]) + 1,
  });

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
        select word #{answer.index}
      </BodyContent>
      <Div
        $css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          width: 100%;
        `}
      >
        {wordArr?.data.map((word) => (
          <Button
            key={word}
            variant={selected === word ? 'secondary' : 'default'}
            onClick={() => setSelected(word)}
          >
            {word}
          </Button>
        ))}
      </Div>
    </>
  );
};
