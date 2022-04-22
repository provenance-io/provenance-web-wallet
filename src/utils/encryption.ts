import encUTF8 from 'crypto-js/enc-utf8'
import AES from 'crypto-js/aes';

type Password = string

export const encrypt = (privateValue: any, password: Password) => {
  const encrypted = AES.encrypt(privateValue, password);
  const encryptedString = encrypted.toString();
  return encryptedString;
};

export const decrypt = (encryptedDataString: string, password: Password) => {
  const test = '6444c3bb26fdc7281a090d607d9de9faaf9d60e6928dcad0a3…e3a1b7c189d73afedb6d2be2de00b00c65aa4a3860f16b703';
  const testDecrypted = AES.decrypt(test, "6361c0d7f81046d0a4f24a8515a5c32b");
  console.log('testDecrypted: ', testDecrypted);
  console.log('testDecrypted.toString(encUTF8): ', testDecrypted.toString(encUTF8));
  const decrypted = AES.decrypt(encryptedDataString, password);
  const decryptedString = decrypted.toString(encUTF8);
  return decryptedString;
};
