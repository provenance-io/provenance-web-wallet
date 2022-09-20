import { useSelector } from 'react-redux';
import type { Account } from 'types';
import { RootState } from 'redux/store';

export const useActiveAccount = () => {
  const { accounts: allAccounts, activeAccountId } = useSelector(
    ({ account }: RootState) => account
  );
  const activeAccount = allAccounts.filter(
    ({ address }: Account) => activeAccountId === address
  )[0];
  return activeAccount || {};
};
