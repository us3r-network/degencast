import { TouchableOpacity, Linking } from "react-native";
import { Text } from "../ui/text";
import { Link } from "expo-router";
import isURL from "validator/lib/isURL";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export default function NeynarCastText({
  cast,
  viewMoreWordLimits,
}: {
  cast: NeynarCast;
  viewMoreWordLimits?: number;
}) {
  const { text, mentioned_profiles } = cast;
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedWebpages = embeds.webpages;
  const segments = text.split(/(\s|\n)/).map((part, index) => {
    if (viewMoreWordLimits) {
      if (index === viewMoreWordLimits) {
        return (
          <Text key={index}>
            <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
              {" "}
              ... view more
            </Text>
          </Text>
        );
      }
      if (index > viewMoreWordLimits) {
        return null;
      }
    }
    if (isMention(part)) {
      const mentionData = mentioned_profiles?.find(
        (profile) => profile.username === part.slice(1),
      );
      if (mentionData) {
        return (
          <Link href={`/u/${mentionData.fid}`} key={index}>
            <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
              {part}
            </Text>
          </Link>
        );
      }
      return (
        <Text
          key={index}
          className="inline-block text-secondary hover:cursor-pointer hover:underline"
        >{`${part}`}</Text>
      );
    }
    if (part.startsWith("/")) {
      const channelId = part.slice(1);
      return (
        <Link key={index} href={`/communities/${channelId}`}>
          <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
            {part}
          </Text>
        </Link>
      );
    }
    if (isURL(part, { require_protocol: false })) {
      const link = !(
        part.toLowerCase().startsWith("https://") ||
        part.toLowerCase().startsWith("http://")
      )
        ? `https://${part}`
        : part;
      const findWebpage = embedWebpages.find((item) => {
        return item.url.includes(part);
      });
      if (findWebpage) return null;

      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            Linking.openURL(link);
          }}
        >
          <Text className="inline-block break-all text-secondary hover:cursor-pointer hover:underline">
            {part}
          </Text>
        </TouchableOpacity>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
  return (
    <Text key={cast.hash} className="inline">
      {segments}
    </Text>
  );
}

function isMention(part: string) {
  return part.startsWith("@");
}
