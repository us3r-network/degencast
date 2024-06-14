import { TWITTER_SCREEN_NAME } from "./twitter";
import { ONCHAIN_ACTION_TYPE } from "./types";
import { WARPCAST_CHANNEL_NAME } from "./warpcast";

export const getCommunityShareTextWithWarpcast = (communityName: string) => {
  return `Check your stats by /${WARPCAST_CHANNEL_NAME}\n Buy early, win early.`;
};

export const getCommunityShareTextWithTwitter = (communityName: string) => {
  return `Hot channel in @${TWITTER_SCREEN_NAME}.\n Buy early, win early.`;
};

export const getAppShareTextWithWarpcast = () => {
  return `Trade & explore news in /${WARPCAST_CHANNEL_NAME}`;
};

export const getAppShareTextWithTwitter = () => {
  return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
};

export const getCastShareTextWithTwitter = () => {
  return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
};

export const getPortfolioTextWithWarpcast = () => {
  return `Trade & explore news in /${WARPCAST_CHANNEL_NAME}`;
};

export const getPortfolioTextWithTwitter = () => {
  return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
};

export const getMintCastTextWithWarpcast = () => {
  return `Mint cast in /${WARPCAST_CHANNEL_NAME}`;
};

export const getMintCastTextWithTwitter = () => {
  return `Mint cast in @${TWITTER_SCREEN_NAME}.`;
};

export const getTransactionShareTextWithWarpcast = (
  type: ONCHAIN_ACTION_TYPE,
  transactionDetailURL: string,
) => {
  switch (type) {
    case ONCHAIN_ACTION_TYPE.SWAP:
      return `Swap tokens in /${WARPCAST_CHANNEL_NAME}\n${transactionDetailURL}\n`;
    default:
      return `Trade & explore news in /${WARPCAST_CHANNEL_NAME}`;
  }
};

export const getTransactionShareTextWithTwitter = (
  type: ONCHAIN_ACTION_TYPE,
  transactionDetailURL: string,
) => {
  switch (type) {
    case ONCHAIN_ACTION_TYPE.SWAP:
      return `Swap tokens in @${TWITTER_SCREEN_NAME}.\n${transactionDetailURL}\n`;
    default:
      return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
  }
};
