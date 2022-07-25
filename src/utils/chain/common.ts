// CHAIN HELPER FUNCTIONS
import {
  convertUtf8ToBuffer as _convertUtf8ToBuffer,
  convertHexToUtf8 as _convertHexToUtf8,
  convertHexToBuffer as _convertHexToBuffer,
  convertArrayBufferToHex as _convertArrayBufferToHex,
} from '@walletconnect/utils';
import { validateMnemonic as bip39vm } from 'bip39';
import { fromBase58 } from 'bip32';
import { decode as bech32Decode } from 'bech32';
import {
  bufferToBytes as _bufferToBytes,
  bytesToBase64 as _bytesToBase64,
} from '@tendermint/belt';
import {
  publicKeyCreate as _secp256k1PublicKeyCreate,
  ecdsaSign as _secp256k1EcdsaSign,
} from 'secp256k1';
import { createHash as _createHash } from 'crypto';

export const createHash = _createHash;
export const secp256k1PublicKeyCreate = _secp256k1PublicKeyCreate;
export const secp256k1EcdsaSign = _secp256k1EcdsaSign;
export const validateMnemonic = bip39vm;
export const bip32FromB58 = fromBase58;
export const convertUtf8ToBuffer = _convertUtf8ToBuffer;
export const convertHexToUtf8 = _convertHexToUtf8;
export const convertHexToBuffer = _convertHexToBuffer;
export const convertArrayBufferToHex = _convertArrayBufferToHex;
export const bufferToBytes = _bufferToBytes;
export const bytesToBase64 = _bytesToBase64;

export const validateAddress = (address: string) => {
  try {
    return !!bech32Decode(address);
  } catch {
    return false;
  }
};
