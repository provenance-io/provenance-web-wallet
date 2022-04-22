import { decrypt } from './encryption';

export const decryptPassword = (password: string) => {
  if (!password) return '';
  return decrypt(password, process.env.REACT_APP_LOCAL_PASS!);
};
