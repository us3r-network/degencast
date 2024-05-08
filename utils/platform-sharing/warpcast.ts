import { Linking, Platform } from "react-native";

export const WARPCAST_WEB_HOST = "https://warpcast.com";
export const WARPCAST_APP_HOST = "warpcast://";
export const WARPCAST_CHANNEL_NAME = "degencast";

export const checkInstalledWarpcastApp = async () => {
  const supported = await Linking.canOpenURL(WARPCAST_APP_HOST);
  return supported;
};

export const openWarpcastCreateCast = async (text: string, url?: string) => {
  const tweetText = text + (url ? `&embeds[]=${url}` : "");
  const warpcastAppUrl = encodeURI(
    `${WARPCAST_APP_HOST}/~/compose?text=${tweetText}`,
  );
  const webUrl = encodeURI(`${WARPCAST_WEB_HOST}/~/compose?text=${tweetText}`);

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
