import { Image, ScrollView, View } from "react-native";
import WarpcastChannelPicker from "~/components/social-farcaster/WarpcastChannelPicker";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { WarpcastChannel } from "~/services/community/api/community";
import ImageSelector from "../common/ImageSelector";

const HomeChanel = {
  id: "",
  name: "Home",
  url: "",
  imageUrl: "",
  createdAt: 0,
};
export default function Editor({
  text,
  setText,
  images,
  setImages,
  channel,
  setChannel,
  previewComponent,
  placeholder = "Create a cast...",
}: {
  text: string;
  setText: (text: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
  channel: WarpcastChannel;
  setChannel: (channel: WarpcastChannel) => void;
  previewComponent?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <View className="flex h-full w-full flex-col gap-5 border-secondary">
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex w-full flex-1  gap-5 "
      >
        <View className="items-center">
          <Textarea
            autoFocus={true}
            className={cn(
              "h-full",
              "border-0 bg-[#fff] text-[12px] text-sm ",
              "w-full rounded-md p-0  outline-none",
              "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
            )}
            placeholder={placeholder}
            value={text}
            onChangeText={setText}
            aria-labelledby="textareaLabel"
          />
        </View>
        <View className="flex flex-col gap-5">
          {images.map((url, i) => {
            return (
              <Image
                resizeMode="contain"
                className="rounded-xl"
                style={{ height: 200, width: "100%" }}
                key={i}
                source={{
                  uri: url,
                }}
              />
            );
          })}
        </View>

        {previewComponent && <View>{previewComponent}</View>}
      </ScrollView>

      <View className="flex flex-row">
        <WarpcastChannelPicker channel={channel} setChannel={setChannel} />
        <View className="flex-grow" />
        <ImageSelector
          imageUrlCallback={(url) => {
            setImages([...images, url]);
          }}
        />
      </View>
    </View>
  );
}