// CONSTANTS/VARIABLES
import {
  PROVENANCE_ADDRESS_PREFIX_MAINNET,
  PROVENANCE_ADDRESS_PREFIX_TESTNET,
  MNEMONIC_WORD_COUNT,
  TESTNET_WALLET_COIN_TYPE,
} from 'consts';
// CHAIN HELPER FUNCTIONS
import {
  generateMnemonic as bip39gm,
  mnemonicToSeedSync as bip39mts,
  validateMnemonic as bip39vm,
} from 'bip39';
import { fromSeed as bip32FromSeed, BIP32Interface, fromBase58 as bip32FromB58 } from 'bip32';
import { toWords as bech32ToWords, encode as bech32Encode } from 'bech32';
import { publicKeyCreate as secp256k1PublicKeyCreate, ecdsaSign as secp256k1EcdsaSign } from 'secp256k1';
import { bufferToBytes, base64ToBytes, bytesToBase64 } from '@tendermint/belt';
import { createHash } from 'crypto';
// TYPESCRIPT TYPES
import type { Bech32String, Bytes } from '@tendermint/types';
import type { Wallet, KeyPair } from '@tendermint/sig';
import { Account, HDPathData, AccountLevel } from 'types';

export const validateMnemonic = bip39vm;

export const createMnemonic = (wordCount = MNEMONIC_WORD_COUNT) => {
  const strength = (wordCount / 3) * 32;
  const mnemonic = bip39gm(strength);
  const valid = validateMnemonic(mnemonic);
  return valid ? mnemonic : '';
}

const sha256 = (bytes: Bytes): Bytes => {
  const buffer1 = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
  const buffer2 = createHash('sha256').update(buffer1).digest();

  return bufferToBytes(buffer2);
}

const ripemd160 = (bytes: Bytes): Bytes => {
  const buffer1 = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
  const buffer2 = createHash('ripemd160').update(buffer1).digest();

  return bufferToBytes(buffer2);
}

export const signBytes = (bytes: Uint8Array, privateKey: Bytes): Uint8Array => {
  const hash = sha256(bytes);
  const { signature } = secp256k1EcdsaSign(hash, privateKey);

  return signature;
}

const createAddress = (publicKey: Bytes, prefix: string = PROVENANCE_ADDRESS_PREFIX_MAINNET!): Bech32String => {
  const hash1 = sha256(publicKey);
  const hash2 = ripemd160(hash1);
  const words = bech32ToWords(hash2);

  return bech32Encode(prefix, words);
}

const createKeyPairFromMasterKey = (masterKey: BIP32Interface, hdPath?: string ): KeyPair => {
  // If it's a root hd path or master node just return the private key without deriving
  const buffer = hdPath && hdPath !== 'm' ? masterKey.derivePath(hdPath).privateKey : masterKey.privateKey;
  if (!buffer) {
    throw new Error('could not derive private key');
  }
  const privateKey = bufferToBytes(buffer);
  const publicKey = secp256k1PublicKeyCreate(privateKey, true);

  return {
    privateKey,
    publicKey,
  };
}

interface CreateWalletProps {
  privateKeyB64: string,
  publicKeyB64: string,
  privateKey: Uint8Array,
  publicKey: Uint8Array,
}

export const createWalletFromMasterKey = (
  masterKey: BIP32Interface | string,
  hdPath?: string,
):CreateWalletProps => {
  let finalMasterKey = masterKey;
  if (typeof masterKey === 'string') finalMasterKey = bip32FromB58(masterKey);
  const { privateKey, publicKey } = createKeyPairFromMasterKey(finalMasterKey as BIP32Interface, hdPath);

  return {
    privateKeyB64: bytesToBase64(privateKey),
    publicKeyB64: bytesToBase64(publicKey),
    privateKey,
    publicKey,
  };
}

const createMasterKeyFromMnemonic = (mnemonic: string): BIP32Interface => {
  const seed = bip39mts(mnemonic);
  return bip32FromSeed(seed);
}

export const createWallet = (privateKeyString: string): Wallet => {
  try {
    const privateKey = base64ToBytes(privateKeyString);
    const publicKey = secp256k1PublicKeyCreate(privateKey);
    const address = createAddress(publicKey);

    return {
      privateKey,
      publicKey,
      address,
    };
  } catch (e) {
    throw new Error('Failed to create account from private key');
  }
}

export const getHDPathData = (hdPath?: string): HDPathData => {
  // If there is no hdPath, or just 'm' is passed in return root account HD path data
  if (!hdPath || hdPath === 'm') return { accountLevel: 'root', root: { value: 'm', display: 'm', hardened: false }};
  // Full path example: "m/44'/1'/0'/0'/0'"
  // Path values: root/purpose/coin_type/account/change/address_index
  const pathValues = ['root', 'purpose', 'coinType', 'account', 'change', 'addressIndex'];
  const splitPath = hdPath.split('/');
  const finalData = {} as HDPathData;
  // Loop through each path value and build results
  splitPath.forEach((rawValue: string, index: number) => {
    const pathName = pathValues[index];
    if (pathName === 'root' || pathName === 'purpose' || pathName === 'coinType' || pathName === 'account' || pathName === 'change' || pathName === 'addressIndex') {
      finalData[pathName] = {
        value: rawValue.includes('m') ? 'm' : Number(rawValue.split("'")[0]),
        hardened: rawValue.includes("'"),
        display: rawValue,
      }
    }
  })
  finalData.accountLevel = pathValues[splitPath.length -1] as AccountLevel;
  return finalData;
}

export const createChildAccount = (parentAccount:Account, childPath?: string):Account => {
  // Pull data to use out of the parent account
  const { masterKey: parentMasterKeyB58, hdPath: parentPath } = parentAccount;
  // MasterKey must exist to create child account
  if (!parentMasterKeyB58) throw new Error ('Parent account missing master key');
  // Convert parentMasterKey from B58STRING to BIP32INTERFACE
  const parentMasterKey = bip32FromB58(parentMasterKeyB58);
  // Determine if the requested path involves the root level
  const isRoot = !childPath || childPath.includes('m');
  const noDerive = !childPath || childPath === 'm';
  // We can't use a path of 'm', must derive from at least 'purpose'
  // When we have a path of '' or 'm', just use the parentMasterKey (nothing to derive)
  const childMasterKey = noDerive ? parentMasterKey : parentMasterKey.derivePath(childPath!);
  // Pull out private/public keys from childMasterKey
  const privateKey = childMasterKey.privateKey;
  if (!privateKey) throw new Error('Could not derive private key');
  const publicKey = childMasterKey.publicKey;
  if (!publicKey) throw new Error('Could not derive public key');
  // Get HDPath data | If this includes 'm', it's a root account and we don't combine
  const fullPath = isRoot ? `${childPath}` : `${parentPath}/${childPath}`;
  const { coinType, accountLevel } = getHDPathData(fullPath);
  // Default prefix is mainnet
  let prefix = PROVENANCE_ADDRESS_PREFIX_MAINNET;
  // Check for testnet prefix
  if (coinType?.value && coinType.value === TESTNET_WALLET_COIN_TYPE) prefix = PROVENANCE_ADDRESS_PREFIX_TESTNET;
  // Determine the network based on the prefix
  const network = prefix === PROVENANCE_ADDRESS_PREFIX_TESTNET ? 'testnet' : 'mainnet';
  // Convert private/public keys to B64strings
  const privateKeyB64 = bytesToBase64(bufferToBytes(privateKey));
  const publicKeyB64 = bytesToBase64(bufferToBytes(publicKey));
  const address = createAddress(bufferToBytes(publicKey), prefix);
  // Convert childMasterKey to B58 for storage
  const childMasterKeyB58 = childMasterKey.toBase58();

  return {
    publicKey: publicKeyB64,
    privateKey: privateKeyB64,
    address,
    masterKey: childMasterKeyB58,
    accountLevel,
    hdPath: fullPath,
    network,
  };
};

export const createRootAccount = (mnemonic: string, rootPath?: string):Account => {
  const rootMasterKey = createMasterKeyFromMnemonic(mnemonic);
  const rootAccount = { masterKey: rootMasterKey.toBase58(), hdPath: 'm' };

  return createChildAccount(rootAccount, rootPath);
};
