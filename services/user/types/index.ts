export type LoginRespEntity = {
  id: number;
};

export enum UserActionName {
  Share = "Share",
  View = "View",
  Like = "Like",
  UnLike = "UnLike",
  Tips = "Tips",
  ConnectFarcaster = "ConnectFarcaster",
  BuyChannelShare = "BuyChannelShare",
}

export type UserActionData = {
  action: UserActionName;
  castHash: string;
  data?: {
    type: string;
    value: any;
  };
};

export type UserActionPointConfig = {
  [key in UserActionName]: {
    unit: number;
    dailyLimit?: number;
  };
};

export type MyWalletTokensRespEntity = {
  wallet: string;
  tokens: TokenInfoWithMetadata[];
};
export type TokenInfoWithMetadata = {
  chainId: number;
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
  amount: number;
  sharesSubject: `0x${string}`;
};

export type TipsInfo = {
  name?: string | undefined;
  logo?: string;
  amount: number;
};
