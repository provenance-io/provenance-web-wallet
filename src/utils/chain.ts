// CONSTANTS/VARIABLES
import { PROVENANCE_ADDRESS_PREFIX_MAINNET } from 'consts';
// LOCAL HELPER FUNCTIONS
import { derivationPath } from 'utils';
// CHAIN HELPER FUNCTIONS
import {
  generateMnemonic as bip39gm,
  mnemonicToSeedSync as bip39mts,
  validateMnemonic as bip39vm,
} from 'bip39';
import { fromSeed as bip32FromSeed, BIP32Interface, fromBase58 as bip32FromB58 } from 'bip32';
import { toWords as bech32ToWords, encode as bech32Encode } from 'bech32';
import { publicKeyCreate as secp256k1PublicKeyCreate } from 'secp256k1';
import { bufferToBytes, base64ToBytes as ogBase64ToBytes, bytesToBase64 as ogBytesToBase64 } from '@tendermint/belt';
import { createHash } from 'crypto';
import { ecdsaSign as secp256k1EcdsaSign } from 'secp256k1';
// TYPESCRIPT TYPES
import type { Bech32String, Bytes } from '@tendermint/types';
import type { Wallet, KeyPair } from '@tendermint/sig';
import { SupportedDenoms } from 'types';
// PROTO IMPORTS
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import { BaseAccount } from '../proto/cosmos/auth/v1beta1/auth_pb';
import { AuthInfo, Fee, ModeInfo, SignDoc, SignerInfo, TxBody, TxRaw } from '../proto/cosmos/tx/v1beta1/tx_pb';
import { PubKey } from '../proto/cosmos/crypto/secp256k1/keys_pb';
import { Coin } from '../proto/cosmos/base/v1beta1/coin_pb';
import { SignMode } from '../proto/cosmos/tx/signing/v1beta1/signing_pb';

const walletPrefix = PROVENANCE_ADDRESS_PREFIX_MAINNET!;
const defaultDerivationPath = derivationPath();
const mnemonicWordCount = 24

export const bytesToBase64 = ogBytesToBase64;
export const base64ToBytes = ogBase64ToBytes

export const validateMnemonic = bip39vm;

export const createMnemonic = (wordCount = mnemonicWordCount) => {
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

const signBytes = (bytes: Uint8Array, privateKey: Bytes): Uint8Array => {
  console.log('signBytes | bytes: ', bytes);
  console.log('signBytes | privateKey: ', privateKey);
  const hash = sha256(bytes);
  console.log('signBytes | hash: ', hash);
  const { signature } = secp256k1EcdsaSign(hash, privateKey);
  console.log('signBytes | signature: ', signature);

  return signature;
}

const buildSignDoc = (accNumber: number, chainId: string, txRaw: TxRaw): SignDoc => {
  const signDoc = new SignDoc();
  signDoc.setAccountNumber(accNumber);
  signDoc.setAuthInfoBytes(txRaw.getAuthInfoBytes());
  signDoc.setChainId(chainId);
  signDoc.setBodyBytes(txRaw.getBodyBytes());
  return signDoc;
}

const buildTxBody = (msgAny: google_protobuf_any_pb.Any | google_protobuf_any_pb.Any[], memo: string): TxBody => {
  const txBody = new TxBody();
  if (Array.isArray(msgAny)) txBody.setMessagesList(msgAny);
  else txBody.addMessages(msgAny);
  txBody.setMemo(memo);
  // txBody.setTimeoutHeight();
  return txBody;
}

const buildSignerInfo = (baseAccount: BaseAccount, pubKeyBytes: Bytes): SignerInfo => {
  const single = new ModeInfo.Single();
  single.setMode(SignMode.SIGN_MODE_DIRECT);
  const modeInfo = new ModeInfo();
  modeInfo.setSingle(single);
  const signerInfo = new SignerInfo();
  const pubKey = new PubKey();
  pubKey.setKey(pubKeyBytes);
  const pubKeyAny = new google_protobuf_any_pb.Any();
  pubKeyAny.pack(pubKey.serializeBinary(), 'cosmos.crypto.secp256k1.PubKey', '/');
  signerInfo.setPublicKey(pubKeyAny);
  signerInfo.setModeInfo(modeInfo);
  signerInfo.setSequence(baseAccount.getSequence());
  return signerInfo;
}
const buildAuthInfo = (signerInfo: SignerInfo, feeDenom: SupportedDenoms, feeEstimate = 0, gasEstimate: number): AuthInfo => {
  const feeCoin = new Coin();
  feeCoin.setDenom(feeDenom);
  feeCoin.setAmount(feeEstimate.toString());
  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(gasEstimate);
  const authInfo = new AuthInfo();
  authInfo.setFee(fee);
  authInfo.setSignerInfosList([signerInfo]);
  return authInfo;
}

interface SignMessageType {
  msgAny: google_protobuf_any_pb.Any | google_protobuf_any_pb.Any[],
  account: BaseAccount,
  chainId: string,
  wallet: Wallet,
  memo: string,
  feeDenom: SupportedDenoms,
  gasPrice: number,
  gasAdjustment: number
}
export const signMessage = ({
  msgAny,
  account,
  chainId,
  wallet,
  memo = '',
  feeDenom = 'nhash',
  gasPrice,
  gasAdjustment = 1.25,
}:SignMessageType) => {
  const signerInfo = buildSignerInfo(account, wallet.publicKey);
  const authInfo = buildAuthInfo(signerInfo, feeDenom, undefined, gasPrice);
  const txBody = buildTxBody(msgAny, memo);
  const txRaw = new TxRaw();
  txRaw.setBodyBytes(txBody.serializeBinary());
  txRaw.setAuthInfoBytes(authInfo.serializeBinary());
  const signDoc = buildSignDoc(account.getAccountNumber(), chainId, txRaw);
  const signature = signBytes(signDoc.serializeBinary(), wallet.privateKey);

  return signature;
}

const createAddress = (publicKey: Bytes, prefix: string = walletPrefix): Bech32String => {
  const hash1 = sha256(publicKey);
  const hash2 = ripemd160(hash1);
  const words = bech32ToWords(hash2);

  return bech32Encode(prefix, words);
}

const createKeyPairFromMasterKey = (masterKey: BIP32Interface, path: string): KeyPair => {
  const buffer = masterKey.derivePath(path).privateKey;
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

export const createWalletFromMasterKey = (
  masterKey: BIP32Interface | string,
  prefix: string = walletPrefix,
  path: string = defaultDerivationPath
): Wallet => {
  let finalMasterKey = masterKey;
  if (typeof masterKey === 'string') finalMasterKey = bip32FromB58(masterKey);
  const { privateKey, publicKey } = createKeyPairFromMasterKey(finalMasterKey as BIP32Interface, path);
  const address = createAddress(publicKey, prefix);

  return {
    privateKey,
    publicKey,
    address,
  };
}

export const createMasterKeyFromMnemonic = (mnemonic: string): BIP32Interface => {
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
