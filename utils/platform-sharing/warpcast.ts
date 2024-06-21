import { Linking, Platform } from "react-native";

export const WARPCAST_WEB_HOST = "https://warpcast.com";
export const WARPCAST_APP_HOST = "warpcast://";
export const WARPCAST_CHANNEL_NAME = "degencast";

export const checkInstalledWarpcastApp = async () => {
  const supported = await Linking.canOpenURL(WARPCAST_APP_HOST);
  return supported;
};

export const embedsToQueryParams = (embeds?: string[]) => {
  return embeds && embeds.length > 0
    ? embeds.map((embed) => `embeds[]=${embed}`).join("&")
    : "";
};

export const openWarpcastCreateCast = async (
  text: string,
  embeds?: string[],
) => {
  const embedsString = embedsToQueryParams(embeds);
  const params = `text=${text}${embedsString ? `&${embedsString}` : ""}`;
  const warpcastAppUrl = encodeURI(`${WARPCAST_APP_HOST}/~/compose?${params}`);
  const webUrl = encodeURI(`${WARPCAST_WEB_HOST}/~/compose?${params}`);

  if (Platform.OS === "web") {
    return Linking.openURL(webUrl);
  }
  const supported = await Linking.canOpenURL(warpcastAppUrl);
  if (supported) {
    return Linking.openURL(warpcastAppUrl);
  } else {
    return Linking.openURL(webUrl);
  }
};
