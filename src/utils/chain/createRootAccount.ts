import { BIP32Interface, Account } from 'types';
import { createChildAccount } from './createChildAccount';
import { fromSeed as bip32FromSeed } from 'bip32';
import { mnemonicToSeedSync as bip39mts } from 'bip39';

// TODO: Change these function to be more simple
// Something like: 'createAccountFromMnemonic' and 'createChildAccountFromParentAccount'
// Needs to describe what it's doing in the name a bit better.

const createMasterKeyFromMnemonic = (mnemonic: string): BIP32Interface => {
  const seed = bip39mts(mnemonic);
  return bip32FromSeed(seed);
};

export const createRootAccount = (mnemonic: string, childPath?: string): Account => {
  const rootMasterKey = createMasterKeyFromMnemonic(mnemonic);
  const rootMasterKeyB64 = rootMasterKey.toBase58();
  const rootHdPath = 'm';

  return createChildAccount(rootMasterKeyB64, rootHdPath, childPath);
};
