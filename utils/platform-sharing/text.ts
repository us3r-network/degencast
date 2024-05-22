import { TWITTER_SCREEN_NAME } from "./twitter";
import { WARPCAST_CHANNEL_NAME } from "./warpcast";

export const getCommunityShareTextWithWarpcast = (communityName: string) => {
  return `Check your stats by /${WARPCAST_CHANNEL_NAME}. Buy early, win early.`;
};

export const getCommunityShareTextWithTwitter = (communityName: string) => {
  return `Hot channel in @${TWITTER_SCREEN_NAME}. Buy early, win early.`;
};

export const getAppShareTextWithWarpcast = () => {
  return `Trade & explore news in /${WARPCAST_CHANNEL_NAME}.`;
};

export const getAppShareTextWithTwitter = () => {
  return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
};

export const getCastShareTextWithTwitter = () => {
  return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
};

export const getMintCastTextWithWarpcast = () => {
  return `Mint cast in /${WARPCAST_CHANNEL_NAME}.`;
};

export const getMintCastTextWithTwitter = () => {
  return `Mint cast in @${TWITTER_SCREEN_NAME}.`;
};
