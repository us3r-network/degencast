import { Author, NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { ERC42069Token } from "~/services/trade/types";
import { AttentionTokenEntity } from "./attention-token";
import { CommunityEntity } from "./community";
import { Address } from "viem";

export type ActivitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: ActivityFilterType;
  operationCatagery?: ActivityOperationCatagery;
};

export enum ActivityOperation {
  BUY = "buy",
  SELL = "sell",
  SWAP = "swap",
  MINT = "mint",
  BURN = "burn",
  PROPOSE = "propose",
  DISPUTE = "dispute",
}

export enum ActivityFilterType {
  ALL = "all",
  POWERUSERS = "powerusers",
  MINE = "mine",
  FOLLOWING = "following",
}

export enum ActivityOperationCatagery {
  PROPOSAL = "proposal",
  NFT = "nft",
  REWARD = "reward",
}

export type ActivityEntity = {
  operation: ActivityOperation;
  tokenInfo: TokenEntity | AttentionTokenEntity;
  tokenAmount: number;
  paymentTokenInfo: TokenEntity;
  paymentTokenAmount: number;
  userAddr: string;
  user: Author;
  timestamp: number;
  // same as explore feed cast
  channel: CommunityEntity;
  cast: NeynarCast;
	proposal: ProposalEntity;
};

export type TokenEntity = {
  name: string;
  logo: string;
  decimals: number;
  symbol: string;
  contractAddress: Address;
  chainId: number;
};