export type VolumeStats = {
  volume_usd: string;
  date: number;
  _id: string;
};
export type TokenInfoWithStats = {
  id: string;
  tokenAddress: string;
  name?: string | undefined;
  imageURL?: string;
  volumeStats: VolumeStats[];
  stats: {
    market_cap_usd: string;
    price_change_percentage: {
      h1: string;
      h6: string;
      h24: string;
      m5: string;
    };
  };
};

export type ShareInfo = {
  name?: string | undefined;
  logo?: string;
  priceUsd: number;
  assetId: number;
  trend: number;
};

export type TipsInfo = {
  name?: string | undefined;
  logo?: string;
  amount: number;
};
