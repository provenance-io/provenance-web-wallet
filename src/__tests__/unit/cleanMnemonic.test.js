import { cleanMnemonic } from 'utils/cleanMnemonic';

const mnemonicTestItems = [
  { mnemonic: '', result: [] },
  { mnemonic: 'apple', result: ['apple'] },
  { mnemonic: 'apple tree', result: ['apple', 'tree'] },
  { mnemonic: 'apple tree fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: '1.apple 2.tree 3.fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: '1)apple 2)tree 3)fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: 'apple,tree,fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: ',apple,tree,fox,', result: ['apple', 'tree', 'fox'] },
  { mnemonic: ' apple tree fox ', result: ['apple', 'tree', 'fox'] },
  { mnemonic: 'apple-tree-fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: '_apple_tree_fox', result: ['apple', 'tree', 'fox'] },
  { mnemonic: '*1._*)apple*2._*)tree*3._*)fox', result: ['apple', 'tree', 'fox'] },
];

// ----------------------------------------------------------------------------------
// Test various words, sentences, and arrays to see if they are valid mnemonics
// ----------------------------------------------------------------------------------
describe('Create new accounts at each possible HD level', () => {
  mnemonicTestItems.forEach(({ mnemonic, result }) => {
    test(`Pull any valid mnemonics from "${mnemonic}"`, () => {
      expect(cleanMnemonic(mnemonic)).toEqual(result);
    });
  });
});
