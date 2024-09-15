import { TWITTER_SCREEN_NAME } from "./twitter";
import { ONCHAIN_ACTION_TYPE } from "./types";
import { WARPCAST_CHANNEL_NAME } from "./warpcast";

export const getCommunityShareTextWithWarpcast = (communityName: string) => {
  return `Hot channel in /${WARPCAST_CHANNEL_NAME}\n Buy early, win early.`;
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

export const getCastProposalShareTextWithWarpcast = (
  fname: string,
  channelId: string,
) => {
  return `Propose to permanently archive on Arweave for @${fname} in /${channelId}`;
  // return `Use frame to vote the proposal in /${WARPCAST_CHANNEL_NAME}`;
};
export const getCastProposalShareTextWithTwitter = () => {
  return `Vote the proposal in @${TWITTER_SCREEN_NAME}`;
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
  transactionDetailURL?: string,
  frameLink?: string,
) => {
  let text = "";
  switch (type) {
    case ONCHAIN_ACTION_TYPE.SWAP_TOKEN:
      text = `Swap tokens in`;
      break;
    case ONCHAIN_ACTION_TYPE.SEND_TOKEN:
      text = `Send tokens in`;
      break;
    case ONCHAIN_ACTION_TYPE.MINT_NFT:
      text = `Mint NFT in`;
      break;
    case ONCHAIN_ACTION_TYPE.BURN_NFT:
      text = `Burn NFT in`;
      break;
    default:
      text = `Trade & explore news in /${WARPCAST_CHANNEL_NAME}`;
      return text;
  }
  // console.log("transactionDetailURL", text, transactionDetailURL, frameLink);
  return `${text} /${WARPCAST_CHANNEL_NAME}\n${transactionDetailURL || ""}\n${frameLink || ""}\n`;
};

export const getTransactionShareTextWithTwitter = (
  type: ONCHAIN_ACTION_TYPE,
  transactionDetailURL?: string,
) => {
  switch (type) {
    case ONCHAIN_ACTION_TYPE.SWAP_TOKEN:
      return `Swap tokens in @${TWITTER_SCREEN_NAME}.\n${transactionDetailURL || ""}\n`;
    case ONCHAIN_ACTION_TYPE.SEND_TOKEN:
      return `Send tokens in @${TWITTER_SCREEN_NAME}.\n${transactionDetailURL || ""}\n`;
    case ONCHAIN_ACTION_TYPE.MINT_NFT:
      return `Mint NFT in @${TWITTER_SCREEN_NAME}.\n${transactionDetailURL || ""}\n`;
    case ONCHAIN_ACTION_TYPE.BURN_NFT:
      return `Burn NFT in @${TWITTER_SCREEN_NAME}.\n${transactionDetailURL || ""}\n`;
    default:
      return `Trade & explore news in @${TWITTER_SCREEN_NAME}.`;
  }
};
