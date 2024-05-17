import { ResizeMode, Video } from "expo-av";
import { isDesktop } from "react-device-detect";
import { Platform, View } from "react-native";
import WebVideoRender from "~/components/common/WebVideoRender";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function EmbedVideo({ uri }: { uri: string }) {
  return (
    <View className="w-full">
      <AspectRatio ratio={16 / 9}>
        {Platform.OS === "web" && isDesktop ? (
          <WebVideoRender src={uri} />
        ) : (
          <Video
            style={{
              width: "100%",
              height: "100%",
            }}
            videoStyle={{
              width: "100%",
              height: "100%",
            }}
            source={{
              uri,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        )}
      </AspectRatio>
    </View>
  );
}
