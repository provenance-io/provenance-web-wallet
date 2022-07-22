import {
  TESTNET_NETWORK,
  ADDRESS_PREFIX_TESTNET,
  ADDRESS_PREFIX_MAINNET,
} from 'consts';
import { BIP32Interface, AccountNetwork, CreateWalletProps } from 'types';
import {
  bufferToBytes,
  bip32FromB58,
  secp256k1PublicKeyCreate,
  bytesToBase64,
} from './common';
import { createAddress } from './createAddress';

export const createWalletFromMasterKey = (
  masterKey: BIP32Interface | string,
  network?: AccountNetwork
): CreateWalletProps => {
  let finalMasterKey = masterKey as BIP32Interface;
  if (typeof masterKey === 'string') finalMasterKey = bip32FromB58(masterKey);
  // If it's a root hd path or master node just return the private key without deriving
  const privateKeyBuffer = finalMasterKey.privateKey;
  if (!privateKeyBuffer) {
    throw new Error('could not derive private key');
  }
  const privateKey = bufferToBytes(privateKeyBuffer);
  const publicKey = secp256k1PublicKeyCreate(privateKey, true);
  const addressPrefix =
    network === TESTNET_NETWORK ? ADDRESS_PREFIX_TESTNET : ADDRESS_PREFIX_MAINNET;
  const address = createAddress(
    bufferToBytes(finalMasterKey.publicKey),
    addressPrefix
  );

  return {
    privateKeyB64: bytesToBase64(privateKey),
    publicKeyB64: bytesToBase64(publicKey),
    privateKey,
    publicKey,
    address,
  };
};
