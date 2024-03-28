import { Embeds } from "~/utils/farcaster/getEmbeds";
import { View, Image } from "react-native";

export default function EmbedImg({ imgs }: { imgs: Embeds["imgs"] }) {
  return (
    <View>
      {imgs.map((img, idx) => (
        <Image
          className="max-w-full object-cover"
          key={img.url}
          source={{ uri: img.url }}
        />
      ))}
    </View>
  );
}
