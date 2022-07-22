import { MNEMONIC_WORD_COUNT } from 'consts';
import { validateMnemonic } from './common';
import { generateMnemonic as bip39gm } from 'bip39';

export const createMnemonic = (wordCount = MNEMONIC_WORD_COUNT) => {
  const strength = (wordCount / 3) * 32;
  const mnemonic = bip39gm(strength);
  const valid = validateMnemonic(mnemonic);
  return valid ? mnemonic : '';
};
