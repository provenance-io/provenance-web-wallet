import { Bytes } from 'types';
import { sha256 } from './sha256';
import { secp256k1EcdsaSign } from './common';

export const signBytes = (bytes: Uint8Array, privateKey: Bytes): Uint8Array => {
  const hash = sha256(bytes);
  const { signature } = secp256k1EcdsaSign(hash, privateKey);

  return signature;
};
