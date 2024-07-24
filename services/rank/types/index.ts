export enum RankOrderBy {
  LAUNCH_PROGRESS = "LaunchProgress",
  NFT_PRICE = "NFTPrice",
  NEW_PROPOSALS = "NewProposals",
  NEW_CASTS = "NewCasts",
  MEMBERS = "Members",
  CREATED_DATE = "CreatedDate",
  MARKET_CAP = "MarketCap",
  TOKEN_PRICE = "TokenPrice",
  NUMBER_OF_TRADE = "NumberOfTrade",
  GROWTH_RATE = "GrowthRate",
}

export type OrderParams = {
  order: "ASC" | "DESC";
  orderBy: RankOrderBy;
};