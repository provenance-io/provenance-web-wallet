import encUTF8 from 'crypto-js/enc-utf8'
import AES from 'crypto-js/aes';

type Password = string

export const encrypt = (privateValue: string, password: Password) => {
  const encrypted = AES.encrypt(privateValue, password);
  const encryptedString = encrypted.toString();
  return encryptedString;
};

export const decrypt = (encryptedDataString: string, password: Password) => {
  const decrypted = AES.decrypt(encryptedDataString, password);
  const decryptedString = decrypted.toString(encUTF8);
  return decryptedString;
};
