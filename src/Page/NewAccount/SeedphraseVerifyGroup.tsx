import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typo } from 'Components';

const WordRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  width: 100%;
`;

interface Props {
  mnemonicArray: string[];
  setCorrect: (arg: boolean) => void;
  wordArr: {
    data: string[];
    index: number;
  };
}

export const SeedphraseVerifyGroup = ({
  mnemonicArray,
  setCorrect,
  wordArr,
}: Props) => {
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
      <Typo type="body" marginBottom="10px" marginTop="30px">
        select word #{answer.index}
      </Typo>
      <WordRow>
        {wordArr?.data.map((word) => (
          <Button
            key={word}
            variant={selected === word ? 'secondary' : 'default'}
            onClick={() => setSelected(word)}
          >
            {word}
          </Button>
        ))}
      </WordRow>
    </>
  );
};
