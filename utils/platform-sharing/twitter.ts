import { Linking, Platform } from "react-native";

export const TWITTER_WEB_HOST = "https://twitter.com";
export const TWITTER_APP_HOST = "twitter://";

export const checkInstalledTwitterApp = async () => {
  const supported = await Linking.canOpenURL(TWITTER_APP_HOST);
  return supported;
};

export const openTwitterCreateTweet = async (text: string, url?: string) => {
  const tweetText = text + (url ? ` ${url}` : "");
  const twitterAppUrl = `${TWITTER_APP_HOST}/post?message=${encodeURIComponent(tweetText)}`;
  const webUrl = `${TWITTER_WEB_HOST}/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  if (Platform.OS === "web") {
    return Linking.openURL(webUrl);
  }

  const supported = await Linking.canOpenURL(twitterAppUrl);
  if (supported) {
    return Linking.openURL(twitterAppUrl);
  } else {
    return Linking.openURL(webUrl);
  }
};
