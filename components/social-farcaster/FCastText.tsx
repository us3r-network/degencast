import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { View, TouchableOpacity, Linking } from "react-native";
import { Text } from "../ui/text";
import { Link } from "expo-router";
import isURL from "validator/lib/isURL";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";

const BIOLINK_FARCASTER_SUFFIX = "fcast";
const farcasterHandleToBioLinkHandle = (handle: string) => {
  return handle
    ? `${handle.replace(/\.[^.]+$/, "")}.${BIOLINK_FARCASTER_SUFFIX}`
    : "";
};

export default function FCastText({
  cast,
  farcasterUserDataObj,
  viewMoreWordLimits,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  viewMoreWordLimits?: number;
}) {
  const { text, mentions, mentionsPositions: indices } = cast;
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedWebpages = embeds.webpages;
  const segments = splitAndInsert(
    text,
    indices || [],
    (mentions || []).map((mention, index) => {
      const mentionData = farcasterUserDataObj?.[mention];
      if (!mentionData) return null;
      return (
        <Link href={`/u/${mentionData.fid}/tokens`} key={index}>
          <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
            {`@${mentionData.userName}`}
          </Text>
        </Link>
      );
    }),
    (s, index) => {
      return (
        <Text className="inline" key={index}>
          {s.split(/(\s|\n)/).map((part, index_) => {
            if (viewMoreWordLimits) {
              if (index_ === viewMoreWordLimits) {
                return (
                  <Text key={index_}>
                    <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
                      {" "}
                      ... view more
                    </Text>
                  </Text>
                );
              }
              if (index_ > viewMoreWordLimits) {
                return null;
              }
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
                  key={index_}
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
            if (part.startsWith("/")) {
              const channelId = part.slice(1);
              return (
                <Link key={index_} href={`/communities/${channelId}`}>
                  <Text className="inline-block text-secondary hover:cursor-pointer hover:underline">
                    {part}
                  </Text>
                </Link>
              );
            }
            return part;
          })}
        </Text>
      );
    },
  );
  return <Text key={cast.id}>{segments}</Text>;
}

function splitAndInsert(
  input: string,
  indices: number[],
  insertions: Array<JSX.Element | null>,
  elementBuilder: (s: string, key: any) => JSX.Element,
) {
  const result = [];
  let lastIndex = 0;

  indices.forEach((index, i) => {
    result.push(
      elementBuilder(
        Buffer.from(input).slice(lastIndex, index).toString(),
        `el-${i}`,
      ),
    );
    result.push(insertions[i]);
    lastIndex = index;
  });

  result.push(
    elementBuilder(
      Buffer.from(input).slice(lastIndex).toString(),
      `el-${indices.length}`,
    ),
  ); // get remaining part of string

  return result;
}
