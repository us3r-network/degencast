import { Image, Pressable, ScrollView, View } from "react-native";
import WarpcastChannelPicker from "~/components/social-farcaster/WarpcastChannelPicker";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { WarpcastChannel } from "~/services/community/api/community";
import ImageSelector from "../common/ImageSelector";
import { Text } from "../ui/text";
import { CircleCheck } from "../common/Icons";
import Toast from "react-native-toast-message";

const HomeChanel = {
  id: "",
  name: "Home",
  url: "",
  imageUrl: "",
  createdAt: 0,
};

export const SIGNATURE_TEXT = "Sent from degencast.wtf";
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
  const isSignature = text.includes(SIGNATURE_TEXT);
  const maxLen = 320;
  return (
    <View className="flex h-full w-full flex-col gap-5 border-secondary">
      <View className="flex-1">
        <ScrollView
          style={{ flex: 1, height: "100%" }}
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
              style={{
                height: 180,
              }}
              maxLength={maxLen}
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
      </View>
      <Pressable
        className="flex w-auto flex-row items-center gap-2"
        onPress={() => {
          if (isSignature) {
            setText(text.replace(SIGNATURE_TEXT, "").trimEnd());
          } else {
            const signatureDisabled =
              text.length + SIGNATURE_TEXT.length > maxLen;
            if (signatureDisabled) {
              Toast.show({
                type: "error",
                text1: "max length exceeded",
              });
              return;
            }
            setText(`${text}\n${SIGNATURE_TEXT}`);
          }
        }}
      >
        <CircleCheck
          className={cn(
            "size-5 fill-transparent stroke-secondary",
            isSignature && "fill-secondary stroke-white",
          )}
        />
        <Text className="text-xs text-[#9BA1AD]">
          Signature: {SIGNATURE_TEXT}
        </Text>
      </Pressable>
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
