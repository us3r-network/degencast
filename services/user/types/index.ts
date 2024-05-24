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
  data?: any;
};

export type UserActionPointConfig = {
  [key in UserActionName]: {
    unit: number;
    dailyLimit?: number;
  };
};

export type TipsInfo = {
  name?: string | undefined;
  channelId: string;
  logo?: string;
  amount: number;
};
