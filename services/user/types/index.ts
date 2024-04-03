import { OwnedToken } from "alchemy-sdk";

export type LoginRespEntity = {};

export type MyWalletTokensRespEntity = {
  wallet: string;
  tokens: OwnedToken[];
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
