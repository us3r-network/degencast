import { Text } from "../ui/text";

import { View, TouchableOpacity, Linking } from "react-native";
import { Href, Link } from "expo-router";
import isURL from "validator/lib/isURL";

export default function NeynarText({ text }: { text: string }) {
  const segments = text.split(/(\s|\n)/).map((part, index) => {
    console.log("neynar-text", { part, index });
    if (isMention(part)) {
      return (
        <Text
          key={index}
          className="inline-block text-[#A36EFE] hover:cursor-pointer hover:underline"
        >{`${part}`}</Text>
      );
    }
    if (part.startsWith("/")) {
      const channelId = part.slice(1);
      return (
        <Link key={index} href={`/communities/${channelId}` as Href<string>}>
          <Text className="inline-block text-[#A36EFE] hover:cursor-pointer hover:underline">
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
      return (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(link)}
          className="inline text-primary hover:underline"
        >
          <Text className="inline-block break-all text-[#A36EFE] hover:cursor-pointer hover:underline">
            {part}
          </Text>
        </TouchableOpacity>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
  return <Text>{segments}</Text>;
}

function isMention(part: string) {
  return part.startsWith("@");
}
