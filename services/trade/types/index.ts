export type TokenInfoWithStats = {
  contractAddress: string;
  name?: string | undefined;
  rawBalance?: BigInt | string;
  decimals?: number | undefined;
  balance?: number | string | undefined;
  symbol?: string | undefined;
  logo?: string;
};

export type ShareInfo = {
  name?: string | undefined;
  logo?: string;
  amount:number;
  assetId:number;
};

export type TipsInfo = {
  name?: string | undefined;
  logo?: string;
  amount:number;
};