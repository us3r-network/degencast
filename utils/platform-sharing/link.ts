// TODO env
export const DEGENCAST_WEB_HOST =
  process.env.EXPO_PUBLIC_DEGENCAST_WEB_HOST || "https://dev.degencast.xyz";

export const getCastDetailWebsiteLink = (castHex: string) => {
  return `${DEGENCAST_WEB_HOST}/casts/${castHex}`;
};

// TODO cast detail frame link
export const getCastDetailFrameLink = (castHex: string) => {
  return `${DEGENCAST_WEB_HOST}/casts/${castHex}`;
};

export const getCommunityWebsiteLink = (id: string) => {
  return `${DEGENCAST_WEB_HOST}/communities/${id}`;
};

// TODO community frame link
export const getCommunityFrameLink = (id: string) => {
  return `${DEGENCAST_WEB_HOST}/communities/${id}`;
};

export const getAppWebsiteLink = () => {
  return DEGENCAST_WEB_HOST;
};
export const getAppFrameLink = () => {
  return DEGENCAST_WEB_HOST;
};
