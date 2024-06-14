import {
  mainnet,
  goerli,
  optimism,
  optimismGoerli,
  sepolia,
  zoraTestnet,
  zora,
  base,
  pgn,
} from "viem/chains";
import { ZORA_CREATE_REFERRAL } from "~/constants/zora";

export const zoraMainnetChainIds: number[] = [
  mainnet.id,
  zora.id,
  optimism.id,
  base.id,
  pgn.id,
];
export const zoraMainnetMintHost = "https://zora.co";
export const zoraTestnetMintHost = "https://testnet.zora.co";

export const getZoraNetwork = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return mainnet;
    case goerli.id:
      return goerli;
    case optimism.id:
      return optimism;
    case optimismGoerli.id:
      return optimismGoerli;
    case sepolia.id:
      return sepolia;
    case zoraTestnet.id:
      return zoraTestnet;
    case zora.id:
      return zora;
    case base.id:
      return base;
    case pgn.id:
      return pgn;
    default:
      return null;
  }
};

export const getZoraNetworkExplorer = (chainId: number) => {
  return getZoraNetwork(chainId)?.blockExplorers.default.url;
};

export const getZoraHost = (chainId: number) => {
  return zoraMainnetChainIds.includes(Number(chainId))
    ? zoraMainnetMintHost
    : zoraTestnetMintHost;
};

export const getZoraCollectChainPrefix = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return "eth";
    case zora.id:
      return "zora";
    case optimism.id:
      return "oeth";
    case base.id:
      return "base";
    case pgn.id:
      return "pgn";
    case goerli.id:
      return "gor";
    case optimismGoerli.id:
      return "ogor";
    case sepolia.id:
      return "sep";
    case zoraTestnet.id:
      return "zgor";
    default:
      return null;
  }
};

export const getZoraMintLink = ({
  chainId,
  contractAddress,
  tokenId,
  referrerAddress = ZORA_CREATE_REFERRAL,
}: {
  chainId: number;
  contractAddress: string;
  tokenId: number;
  referrerAddress?: string;
}) => {
  const zoraMintHost = getZoraHost(chainId);
  const chainPrefix = getZoraCollectChainPrefix(chainId);
  return `${zoraMintHost}/collect/${chainPrefix}:${contractAddress}/${tokenId}?referrer=${referrerAddress}`;
};
