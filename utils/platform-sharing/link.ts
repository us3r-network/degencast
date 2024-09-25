import { DEGENCAST_FRAME_HOST, DEGENCAST_WEB_HOST } from "~/constants";
import { getZoraMintLink } from "../zora";

export const getCastDetailWebsiteLink = (
  castHex: string,
  opts?: {
    fid?: string | number;
  },
) => {
  const castHash = castHex.startsWith("0x") ? castHex : `0x${castHex}`;
  let link = `${DEGENCAST_FRAME_HOST}/proposal/frames?castHash=${castHash}`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getCastDetailFrameLink = (
  castHex: string,
  opts?: {
    fid?: string | number;
  },
) => {
  const castHash = castHex.startsWith("0x") ? castHex : `0x${castHex}`;
  let link = `${DEGENCAST_FRAME_HOST}/proposal/frames?castHash=${castHash}`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getCommunityWebsiteLink = (
  id: string,
  opts?: {
    fid?: string | number;
  },
) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationchannel/frames?channelId=${id}`;
  const { fid } = opts || {};
  if (fid) {
    link += `&inviteFid=${fid}`;
  }
  return link;
};

export const getCommunityFrameLink = (
  id: string,
  opts?: {
    fid?: string | number;
  },
) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationchannel/frames?channelId=${id}`;
  const { fid } = opts || {};
  if (fid) {
    link += `&inviteFid=${fid}`;
  }
  return link;
};

export const getAppWebsiteLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationchannel/frames/channels`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};
export const getAppFrameLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationchannel/frames/channels`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link || "";
};

export const getPortfolioWebsiteLink = (opts?: {
  fid: number;
  inviteFid?: number;
}) => {
  const { fid, inviteFid } = opts || {};
  let link = `${DEGENCAST_FRAME_HOST}/curationportfolio/frames?fid=${fid}`;
  if (inviteFid) {
    link += `&inviteFid=${inviteFid}`;
  }
  return link;
};

export const getPortfolioFrameLink = (opts?: {
  fid: number;
  inviteFid?: number;
}) => {
  const { fid, inviteFid } = opts || {};
  let link = `${DEGENCAST_FRAME_HOST}/curationportfolio/frames?fid=${fid}`;
  if (inviteFid) {
    link += `&inviteFid=${inviteFid}`;
  }
  return link;
};

export const getTradePageWebsiteLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_WEB_HOST}/channels/tokens`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

// TODO degencast app frame link ?
export const getTradePageFrameLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_FRAME_HOST}/swaptoken/frames/swap/degen`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getMintNFTFrameLink = (opts?: {
  fid?: string | number;
  castHash: string;
}) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationnft/frames?castHash=${opts?.castHash}`;
  const { fid } = opts || {};
  if (fid) {
    link += `&inviteFid=${fid}`;
  }
  return link;
};

export const getMintNFTWebsiteLink = (opts?: {
  fid?: string | number;
  castHash: string;
}) => {
  let link = `${DEGENCAST_FRAME_HOST}/curationnft/frames?castHash=${opts?.castHash}`;
  const { fid } = opts || {};
  if (fid) {
    link += `&inviteFid=${fid}`;
  }
  return link;
};

export const getMintCastWebsiteLink = (opts: {
  chainId: number;
  contractAddress: string;
  tokenId: number;
}) => {
  const { chainId, contractAddress, tokenId } = opts;
  let link = getZoraMintLink({
    chainId,
    contractAddress,
    tokenId,
  });
  return link;
};

// TODO degencast cast mint frame link ?
export const getMintCastFrameLink = (opts: {
  chainId: number;
  contractAddress: string;
  tokenId: number;
}) => {
  const { chainId, contractAddress, tokenId } = opts;
  let link = getZoraMintLink({
    chainId,
    contractAddress,
    tokenId,
  });
  return link;
};
