import { Embeds } from "~/utils/farcaster/getEmbeds";
import { View } from "react-native";
import { Image } from "expo-image";

export default function EmbedImgs({ imgs }: { imgs: Embeds["imgs"] }) {
  return (
    <View className="h-fit w-full">
      {imgs.map((img, idx) => (
        <View className="h-[300px]" key={img.url}>
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
            source={img.url}
          />
        </View>
      ))}
    </View>
  );
}
