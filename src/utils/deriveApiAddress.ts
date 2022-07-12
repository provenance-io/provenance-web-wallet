import {
  GRPC_CLIENT_ADDRESS_MAINNET,
  GRPC_CLIENT_ADDRESS_TESTNET,
  SERVICE_MOBILE_WALLET_MAINNET,
  SERVICE_MOBILE_WALLET_TESTNET,
  SERVICE_PRICING_ENGINE_MAINNET,
  SERVICE_PRICING_ENGINE_TESTNET,
  ADDRESS_PREFIX_TESTNET
} from 'consts';

const isTestnet = (address: string) =>
  address.startsWith(ADDRESS_PREFIX_TESTNET!);

export const getServiceMobileApi = (address: string, additionalPath: string) => {
  const serviceUrl = isTestnet(address)
    ? SERVICE_MOBILE_WALLET_TESTNET
    : SERVICE_MOBILE_WALLET_MAINNET;
  return `${serviceUrl}${additionalPath}`;
};

export const getServicePricingEngineApi = (address: string, additionalPath: string) => {
  const serviceUrl = isTestnet(address)
    ? SERVICE_PRICING_ENGINE_TESTNET
    : SERVICE_PRICING_ENGINE_MAINNET;
  return `${serviceUrl}${additionalPath}`;
};

export const getGrpcApi = (address: string) => {
  return isTestnet(address)
    ? (GRPC_CLIENT_ADDRESS_TESTNET as string)
    : (GRPC_CLIENT_ADDRESS_MAINNET as string);
};
