export type LoginRespEntity = {
  id: number;
  createdAt: string;
  lastModifiedAt: string;
};

export type InvitationCodeRespEntity = {
  code: string;
  isUsed: boolean;
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
  MintCast = "MintCast",
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
