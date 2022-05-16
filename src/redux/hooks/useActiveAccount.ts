import { useSelector } from 'react-redux';
import { Account } from 'types';
import { RootState } from 'redux/store';

export const useActiveAccount = () => {
  const { accounts: allAccounts, activeAccountId } = useSelector(({ account }: RootState) => account);
  return allAccounts.filter(({ id }: Account) => activeAccountId === id)[0];
};
