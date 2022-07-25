import { WORDLIST } from 'consts';

export const isMnemonic = (value: string | string[], length?: number): Boolean => {
  // Value will either be a single word, string array, or string of multiple words with spaces
  let finalWords;
  // If not already an array of words, convert to one
  if (!Array.isArray(value)) {
    finalWords = value.split(' ');
  } else finalWords = value; // Is already an array of words
  // If requested, see if the length is matched
  if (length && finalWords.length !== length) return false;
  // Loop though each word and make sure it's a valid phrase from list
  const allWordsValid =
    finalWords.filter((word) => !WORDLIST.includes(word)).length === 0;
  // return results
  return allWordsValid;
};
