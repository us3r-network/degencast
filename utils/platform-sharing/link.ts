export const DEGENCAST_WEB_HOST =
  process.env.EXPO_PUBLIC_DEGENCAST_WEB_HOST || "https://dev.degencast.xyz";

// TODO env ?
export const DEGENCAST_FRAME_HOST = "https://beta.frames.degencast.xyz";

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
  let link = `${DEGENCAST_FRAME_HOST}/allowance/${id}`;
  const { fid } = opts || {};
  if (fid) {
    link += `/fid/${fid}`;
  }
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
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
  let link = DEGENCAST_WEB_HOST;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

export const getTradePageWebsiteLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_WEB_HOST}/trade/tokens`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};

// TODO degencast app frame link ?
export const getTradePageFrameLink = (opts?: { fid?: string | number }) => {
  let link = `${DEGENCAST_WEB_HOST}/trade/tokens`;
  const { fid } = opts || {};
  if (fid) {
    link += `?inviteFid=${fid}`;
  }
  return link;
};
