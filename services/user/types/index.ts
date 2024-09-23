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
  ViewChannel = "ViewChannel",
  VoteCast = "VoteCast",
  PostingSignature = "PostingSignature",
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

export type UserAccount = {
  type: UserAccountType;
  thirdpartyId?: string;
  thirdPartyName?: string;
  data?: any;
};

export enum UserAccountType {
  PRIVY = "PRIVY",
  TWITTER = "TWITTER",
  DISCORD = "DISCORD",
  SOLANA = "SOLANA",
  EVM = "EVM",
  APTOS = "APTOS",
  EMAIL = "EMAIL",
  FARCASTER = "FARCASTER",
}
