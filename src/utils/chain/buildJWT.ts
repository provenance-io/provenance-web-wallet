import base64url from 'base64url';
import { BIP32Interface } from 'types';
import {
  bip32FromB58,
  bufferToBytes,
  bytesToBase64,
  convertUtf8ToBuffer,
} from './common';
import { signBytes } from './signBytes';

export const buildJWT = (
  masterKey: BIP32Interface | string,
  address: string,
  expires?: number,
  forceDate?: number
) => {
  let finalMasterKey = masterKey as BIP32Interface;
  // Get BIP32 masterKey (if string passed in)
  if (typeof masterKey === 'string') finalMasterKey = bip32FromB58(masterKey);
  // Get information using masterKey
  const publicKey = bufferToBytes(finalMasterKey.publicKey);
  const privateKey = bufferToBytes(finalMasterKey.privateKey!);
  const publicKeyB64 = bytesToBase64(publicKey);
  // Get basic jwt data together
  const now = forceDate || Math.floor(Date.now() / 1000); // Current time (or use a forcedDate if provided)
  const exp = expires || now + 86400; // (24hours)
  const header = JSON.stringify({ alg: 'ES256K', typ: 'JWT' });
  const headerEncoded = base64url(header);
  const payload = JSON.stringify({
    sub: publicKeyB64,
    iss: 'provenance.io',
    iat: now,
    exp,
    addr: address,
  });
  const payloadEncoded = base64url(payload);
  const jwt = `${headerEncoded}.${payloadEncoded}`;
  const jwtBuffer = convertUtf8ToBuffer(jwt);
  const signature = signBytes(jwtBuffer, privateKey);
  const signedPayloadEncoded = base64url.fromBase64(bytesToBase64(signature));
  const signedJWT = `${headerEncoded}.${payloadEncoded}.${signedPayloadEncoded}`;
  return signedJWT;
};
