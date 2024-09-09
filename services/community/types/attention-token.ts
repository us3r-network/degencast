import { Address } from "viem";

export type AttentionTokenEntity = {
  name: string;
  logo: string;
  progress: string;
  poolAddress?: Address;
  readyToMintCount?: number;
  price?: number;
  priceTrend?: string;
  marketCap?: number;
  buy24h?: number;
  sell24h?: number;
  holders?: number;
  tokenStandard?: string;
  tokenContract: Address;
  danContract: Address;
  chain: string;
  chainId: number;
  bondingCurve: {
    basePrice: number;
  };
};
