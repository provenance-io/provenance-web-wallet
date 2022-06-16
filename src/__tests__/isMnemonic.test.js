import { isMnemonic } from 'utils';

const mnemonicTestItems = [
  { mnemonic: '', result: false, length: 24 },
  { mnemonic: '', result: false, length: undefined },
  { mnemonic: [''], result: false, length: undefined },
  { mnemonic: 'apple', result: true, length: undefined },
  { mnemonic: 'apple', result: true, length: 1 },
  { mnemonic: 'apple dragon', result: true, length: 2 },
  { mnemonic: 'apple dragon', result: true, length: undefined },
  { mnemonic: 'apple, dragon', result: false, length: 2 },
  { mnemonic: 'javascript', result: false, length: undefined },
  { mnemonic: ['apple'], result: true, length: undefined },
  { mnemonic: ['apple', 'tree'], result: true, length: 2 },
  { mnemonic: ['apple', 'tree'], result: false, length: 1 },
  { mnemonic: ['apple', 'javascript'], result: false, length: 2 },
  { mnemonic: ['javascript'], result: false, length: undefined },
];

// ----------------------------------------------------------------------------------
// Test various words, sentences, and arrays to see if they are valid mnemonics
// ----------------------------------------------------------------------------------
describe('Create new accounts at each possible HD level', () => {
  mnemonicTestItems.forEach(({ mnemonic, result, length }) => {
    test(`is "${mnemonic}" a valid mnemonic and length`, () => {
      expect(isMnemonic(mnemonic, length)).toBe(result);
    })
  });
});
