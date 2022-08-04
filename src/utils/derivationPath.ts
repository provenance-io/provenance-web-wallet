import { PROVENANCE_WALLET_COIN_TYPE } from 'consts';

type DerivationType = {
  purpose?: number;
  coin_type?: string | number;
  account?: number;
  change?: number;
  address_index?: number;
};

export const derivationPath = (data?: DerivationType) => {
  const {
    purpose = 44,
    coin_type = PROVENANCE_WALLET_COIN_TYPE,
    account = 0,
    change = 0,
    address_index = 0,
  } = data || {};
  // Testnet is hardened, mainnet is not.
  const isHardened = coin_type === PROVENANCE_WALLET_COIN_TYPE ? '' : "'";

  return `m/${purpose}'/${coin_type}'/${account}'/${change}/${address_index}${isHardened}`;
};

export const customDerivationPath = (data?: DerivationType) => {
  const { purpose = 44, coin_type, account, change, address_index } = data || {};
  // Testnet is hardened, mainnet is not.
  const isHardened = coin_type === PROVENANCE_WALLET_COIN_TYPE ? '' : "'";
  const basePath = `m/${purpose}'`;
  const coinPath = `/${coin_type}'`;
  const accountPath = `/${account}'`;
  const changePath = `/${change}`;
  const addressIndexPath = `/${address_index}${isHardened}`;
  return `${basePath}${coin_type !== undefined ? coinPath : ''}${
    account !== undefined ? accountPath : ''
  }${change !== undefined ? changePath : ''}${
    address_index !== undefined ? addressIndexPath : ''
  }`;
};
