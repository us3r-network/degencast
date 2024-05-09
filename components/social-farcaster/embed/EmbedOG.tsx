import { View, TouchableOpacity, Linking, Image } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { OGData } from "~/services/farcaster/types";

export default function EmbedOG({ data, url }: { data: OGData; url: string }) {
  const img = data.ogImage?.[0]?.url;

  return (
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        Linking.openURL(url);
      }}
    >
      <Card className="flex w-full flex-col overflow-hidden border-secondary bg-muted">
        {img && (
          <Image className="h-48 w-full object-cover" source={{ uri: img }} />
        )}

        <View className="flex flex-col gap-1 p-2">
          <Text className=" font-interBold line-clamp-1 text-xs">
            {data.ogTitle}
          </Text>
          {data.ogDescription && (
            <Text
              className={
                " font-interNormal line-clamp-2 text-xs text-secondary"
              }
            >
              {data.ogDescription}
            </Text>
          )}
          <Text className="font-interNormal text-xs text-secondary">
            {new URL(url).host}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
