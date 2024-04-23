import { TokenInfoWithStats } from "~/services/trade/types";

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
  Invite = "Invite",
  SwapToken = "SwapToken",
}

export type UserActionData = {
  action: UserActionName;
  castHash?: string;
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

export type TokenInfoWithMetadata = {
  chainId: number;
  contractAddress: string;
  name?: string | undefined;
  channelId?: string;
  rawBalance?: BigInt | string;
  decimals?: number | undefined;
  balance?: number | string | undefined;
  symbol?: string | undefined;
  logo?: string;
  tradeInfo?: TokenInfoWithStats;
};

export type ShareInfo = {
  name?: string | undefined;
  channelId: string;
  logo?: string;
  amount: number;
  sharesSubject: `0x${string}`;
};

export type TipsInfo = {
  name?: string | undefined;
  channelId: string;
  logo?: string;
  amount: number;
};
