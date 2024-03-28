import { ResizeMode, Video } from "expo-av";
import { View } from "react-native";

export default function EmbedVideo({ uri }: { uri: string }) {
  return (
    <View className=" h-72 w-full">
      <Video
        style={{ flex: 1 }}
        source={{
          uri,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
    </View>
  );
}
