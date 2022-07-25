import { Bytes, Bech32String } from 'types';
import { sha256 } from './sha256';
import { ADDRESS_PREFIX_MAINNET } from 'consts';
import { createHash, bufferToBytes } from './common';
import { toWords as bech32ToWords, encode as bech32Encode } from 'bech32';

const ripemd160 = (bytes: Bytes): Bytes => {
  const buffer1 = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
  const buffer2 = createHash('ripemd160').update(buffer1).digest();

  return bufferToBytes(buffer2);
};

export const createAddress = (
  publicKey: Bytes,
  prefix: string = ADDRESS_PREFIX_MAINNET!
): Bech32String => {
  const hash1 = sha256(publicKey);
  const hash2 = ripemd160(hash1);
  const words = bech32ToWords(hash2);

  return bech32Encode(prefix, words);
};
