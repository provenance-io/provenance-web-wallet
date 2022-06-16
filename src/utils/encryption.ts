import encUTF8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';

type Password = string

export const encryptKey = (masterKeyB58: string, password: Password) => {
  const encrypted = AES.encrypt(masterKeyB58, password);
  const encryptedString = encrypted.toString();
  return encryptedString;
};

export const decryptKey = (encryptedMasterKeyString: string, password: Password) => {
  const decrypted = AES.decrypt(encryptedMasterKeyString, password);
  try {
    const decryptedString = encUTF8.stringify(decrypted);
    return decryptedString;
  }
  catch {
    return '';
  }
};