import {
  GRPC_CLIENT_ADDRESS_MAINNET,
  GRPC_CLIENT_ADDRESS_TESTNET,
  SMW_MAINNET,
  SMW_TESTNET,
  ADDRESS_PREFIX_TESTNET,
  EXPLORER_WEB_TESTNET,
  EXPLORER_WEB_MAINNET,
  DEFAULT_NETWORK,
} from 'consts';

const isTestnet = (address: string) => address.startsWith(ADDRESS_PREFIX_TESTNET!);

export const getServiceMobileApi = (
  address?: string | void,
  additionalPath?: string
) => {
  // If we have an address, use that to determine testnet vs mainnet.  If there is no address, default to the default_network
  const serviceUrl = address
    ? isTestnet(address)
      ? SMW_TESTNET
      : SMW_MAINNET
    : DEFAULT_NETWORK === 'mainnet'
    ? SMW_MAINNET
    : SMW_TESTNET;
  return `${serviceUrl}${additionalPath}`;
};

export const getGrpcApi = (address: string) => {
  return isTestnet(address)
    ? (GRPC_CLIENT_ADDRESS_TESTNET as string)
    : (GRPC_CLIENT_ADDRESS_MAINNET as string);
};

export const getExplorerApi = (address: string, additionalPath?: string) => {
  const explorerUrl = isTestnet(address)
    ? EXPLORER_WEB_TESTNET
    : EXPLORER_WEB_MAINNET;
  return `${explorerUrl}${additionalPath}`;
};
