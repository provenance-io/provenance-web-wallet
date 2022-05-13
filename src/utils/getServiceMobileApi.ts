import {
  SERVICE_MOBILE_WALLET_MAINNET,
  SERVICE_MOBILE_WALLET_TESTNET,
  PROVENANCE_ADDRESS_PREFIX_TESTNET,
} from 'consts';

// Determine MAINNET vs TESTNET API urls
export const getServiceMobileApi = (address: string, additionalPath: string) => {
  const isTestnet = address.startsWith(PROVENANCE_ADDRESS_PREFIX_TESTNET!);
  const serviceUrl = isTestnet ? SERVICE_MOBILE_WALLET_TESTNET : SERVICE_MOBILE_WALLET_MAINNET;
  return `${serviceUrl}${additionalPath}`;
};
