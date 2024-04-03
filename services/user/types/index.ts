export enum UserActionName {
  Share = "Share",
  View = "View",
  Like = "Like",
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
