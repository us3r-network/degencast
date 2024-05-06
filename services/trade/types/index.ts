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
  };
};

export type TokenWithTradeInfo = {
  chainId: number;
  address: `0x${string}`;
  name: string | undefined;
  decimals: number | undefined;
  symbol: string | undefined;
  logoURI?: string;
  channelId?: string;
  tradeInfo?: TradeInfo;
  rawBalance?: BigInt | string;
  balance?: number | string | undefined;
  //todo: remove this after api is ready
  contractAddress?: `0x${string}`;
  logo?: string;
};

export type ShareInfo = {
  name?: string | undefined;
  channelId: string;
  logo?: string;
  priceETH?: string;
  sharesSubject: `0x${string}`;
  trend: number;
  amount?: number;
};

export type TipsInfo = {
  name?: string | undefined;
  logo?: string;
  amount: number;
};
