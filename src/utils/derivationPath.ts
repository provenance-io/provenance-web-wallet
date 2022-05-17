import { PROVENANCE_WALLET_COIN_TYPE } from 'consts';

type DerivationType = {
  purpose?: number
  coin_type?: string | number,
  account?: number
  change?: number
  address_index?: number
}

export const derivationPath = (data?: DerivationType) => {
  const {
    purpose = 44,
    coin_type = PROVENANCE_WALLET_COIN_TYPE,
    account = 0,
    change = 0,
    address_index = 0,
  } = data || {};

  return `m/${purpose}'/${coin_type}'/${account}'/${change}/${address_index}`;
}
