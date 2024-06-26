import { DEGENCAST_FRAME_HOST, DEGENCAST_WEB_HOST } from "~/constants";
import { getZoraMintLink } from "../zora";

export const getCastDetailWebsiteLink = (
  castHex: string,
  opts?: {
    fid?: string | number;
  },
) => {
  let link = `${DEGENCAST_WEB_HOST}/casts/${castHex}`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

// TODO cast detail frame link ?
export const getCastDetailFrameLink = (
  castHex: string,
  opts?: {
    fid?: string | number;
  },
) => {
  let link = `${DEGENCAST_WEB_HOST}/casts/${castHex}`;
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
  let link = `${DEGENCAST_WEB_HOST}/communities/${id}`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getCommunityFrameLink = (
  id: string,
  opts?: {
    fid?: string | number;
  },
) => {
  let link = `${DEGENCAST_FRAME_HOST}/atttoken/frames?attnft=${id}`;
  const { fid } = opts || {};
  if (fid) {
    link += `&inviteFid=${fid}`;
  }

  // TODO 下面这个链接修复后再还原
  // let link = `${DEGENCAST_FRAME_HOST}/allowance/${id}`;
  // const { fid } = opts || {};
  // if (fid) {
  //   link += `/fid/${fid}`;
  // }
  // if (fid) {
  //   link += `?inviteFid=${fid}`;
  // }
  return link;
};

export const getAppWebsiteLink = (opts?: { fid?: string | number }) => {
  let link = DEGENCAST_WEB_HOST;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};
// TODO degencast app frame link ?
export const getAppFrameLink = (opts?: { fid?: string | number }) => {
  let link = DEGENCAST_FRAME_HOST;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getPortfolioWebsiteLink = (opts?: {
  fid: number;
  inviteFid?: number;
}) => {
  let link = DEGENCAST_WEB_HOST;
  const { fid, inviteFid } = opts || {};
  if (fid) {
    link += `/u/${fid}/tokens?inviteFid=${inviteFid}`;
  }
  return link;
};

export const getPortfolioFrameLink = (opts?: {
  fid: number;
  fname: string;
}) => {
  let link = `${DEGENCAST_FRAME_HOST}/portfolio/frames`;
  const { fid, fname } = opts || {};
  if (fid) {
    link += `?fid=${fid}&fname=${fname}`;
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
