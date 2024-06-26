import { Address } from "viem";

type VolumeStats = {
  volume_usd: string;
  date: number;
  _id: string;
};

export type TradeInfo = {
  id: string;
  chain_id: number;
  channel:string;
  tokenAddress: `0x${string}`;
  name?: string | undefined;
  imageURL?: string;
  volumeStats: VolumeStats[];
  stats: {
    market_cap_usd: string;
    fdv_usd: string;
    token_price_usd: string;
    price_change_percentage: {
      h1: string;
      h6: string;
      h24: string;
      m5: string;
    };
    transactions: {
      h24: {
        buys: number;
        sells: number;
      };
    };
  };
};

export type TokenWithTradeInfo = {
  chainId: number;
  address: `0x${string}`;
  name: string | undefined;
  decimals: number | undefined;
  symbol: string | undefined;
  logoURI?: string;
  tradeInfo?: TradeInfo;
  rawBalance?: bigint | string;
  balance?: number | string | undefined;
};

export type BadgeInfo = {
  tokenAddress: `0x${string}`;
  name?: string | undefined;
  channelId: string;
  logo?: string;
  priceETH?: string;
  amount?: number;
};

export type CreateTokenResp = {
  attentionTokenAddr: Address;
};
