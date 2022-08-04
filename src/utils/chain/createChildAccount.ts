import { Account } from 'types';
import { bip32FromB58, bytesToBase64, bufferToBytes } from './common';
import { getHDPathData } from './getHDPathData';
import { createAddress } from './createAddress';

export const createChildAccount = (
  parentMasterKeyB58: string,
  parentHdPath: string,
  childHdPath?: string
): Account => {
  // Pull data to use out of the parent account
  // MasterKey must exist to create child account
  if (!parentMasterKeyB58) throw new Error('Parent account missing master key');
  // Convert parentMasterKey from B58STRING to BIP32INTERFACE
  const parentMasterKey = bip32FromB58(parentMasterKeyB58);
  // Determine if the requested path involves the root level
  const isRoot = !childHdPath || childHdPath.includes('m');
  const noDerive = !childHdPath || childHdPath === 'm';
  // We can't use a path of 'm', must derive from at least 'purpose'
  // When we have a path of '' or 'm', just use the parentMasterKey (nothing to derive)
  const childMasterKey = noDerive
    ? parentMasterKey
    : parentMasterKey.derivePath(childHdPath!);
  // Pull out private/public keys from childMasterKey
  const privateKey = childMasterKey.privateKey;
  if (!privateKey) throw new Error('Could not derive private key');
  const publicKey = childMasterKey.publicKey;
  if (!publicKey) throw new Error('Could not derive public key');
  // Get HDPath data | If this includes 'm', it's a root account and we don't combine
  const fullPath = isRoot ? `${childHdPath}` : `${parentHdPath}/${childHdPath}`;
  const { accountLevel, network } = getHDPathData(fullPath);
  // Convert private/public keys to B64strings
  const privateKeyB64 = bytesToBase64(bufferToBytes(privateKey));
  const publicKeyB64 = bytesToBase64(bufferToBytes(publicKey));
  const address = createAddress(bufferToBytes(publicKey), network.prefix);
  // Convert childMasterKey to B58 for storage
  const childMasterKeyB58 = childMasterKey.toBase58();

  return {
    publicKey: publicKeyB64,
    privateKey: privateKeyB64,
    address,
    masterKey: childMasterKeyB58,
    accountLevel,
    hdPath: fullPath,
    network: network.value,
  };
};
