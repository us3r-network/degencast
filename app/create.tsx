import { usePrivy } from "@privy-io/react-auth";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import { WarpcastChannel } from "~/services/community/api/community";
import Editor from "~/components/social-farcaster/Editor";
import CreateCastPreviewEmbeds from "~/components/social-farcaster/CreateCastPreviewEmbeds";
import Toast from "react-native-toast-message";
import GoBackButton from "~/components/common/GoBackButton";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";

const HomeChanel = {
  id: "",
  name: "Home",
  url: "",
  imageUrl: "",
  createdAt: 0,
};
export default function CreateScreen() {
  const localSearchParams = useLocalSearchParams();
  console.log("localSearchParams", localSearchParams);
  const {
    embeds: searchEmbeds,
    text: searchText,
    channelId: searchChannelId,
  } = (localSearchParams || {}) as {
    embeds: string[];
    text: string;
    channelId: string;
  };
  const embeds =
    typeof searchEmbeds === "string"
      ? [{ url: searchEmbeds }]
      : typeof searchEmbeds === "object"
        ? searchEmbeds?.map((item) => ({ url: item }))
        : [];
  console.log("embeds", embeds);

  const [posting, setPosting] = useState(false);
  const { submitCast } = useFarcasterWrite();
  const navigation = useNavigation();
  const [value, setValue] = useState(searchText || "");
  const [images, setImages] = useState<string[]>([]);
  const [channel, setChannel] = useState<WarpcastChannel>(HomeChanel);
  const { warpcastChannels } = useWarpcastChannels();
  useEffect(() => {
    if (searchChannelId) {
      const channel = warpcastChannels.find(
        (channel) => channel.id === searchChannelId,
      );
      if (channel) {
        setChannel(channel);
      }
    }
  }, [warpcastChannels, searchChannelId]);
  const { login, ready, user } = usePrivy();

  const fid = user?.farcaster?.fid;

  return (
    <SafeAreaView id="ss" style={{ flex: 1 }} className="h-full bg-white">
      <Stack.Screen
        options={{
          header: () => (
            <View
              className="flex flex-row items-center justify-between bg-white"
              style={{
                height: 70,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <View className="flex flex-row items-center gap-3">
                <GoBackButton
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
              {(posting && (
                <View>
                  <ActivityIndicator className="text-secondary" />
                </View>
              )) || (
                <View>
                  {fid && (
                    <Button
                      className="rounded-full web:bg-[#4C2896] web:hover:bg-[#4C2896] web:active:bg-[#4C2896]"
                      size={"icon"}
                      variant={"ghost"}
                      onPress={async () => {
                        if (posting) return;
                        setPosting(true);
                        const data = {
                          text: value,
                          embeds: [
                            ...(embeds || []),
                            ...images.map((item) => {
                              return { url: item };
                            }),
                          ],
                          channel: channel.url,
                        };

                        const result = await submitCast(data);

                        if (result?.hash) {
                          setValue("");
                          setImages([]);
                          setChannel(HomeChanel);
                          Toast.show({
                            type: "postToast",
                            props: {
                              hash: result?.hash,
                              fid: fid,
                            },
                            // position: "bottom",
                          });
                          setPosting(false);
                          navigation.goBack();
                        }
                      }}
                    >
                      <PostIcon />
                    </Button>
                  )}
                </View>
              )}
            </View>
          ),
        }}
      />
      <View
        className="mx-auto h-full w-full p-4 pt-0 sm:max-w-screen-sm"
        id="create-view"
      >
        {(!fid && (
          <View className="flex-1 p-4 pt-16">
            <Button className="rounded-lg bg-primary px-6 py-3" onPress={login}>
              <Text className="text-primary-foreground">
                Log in with farcaster
              </Text>
            </Button>
          </View>
        )) || (
          <View className="h-full w-full" id="ad">
            <View className="mb-5 flex flex-row items-center gap-1">
              {user?.farcaster?.pfp && (
                <Avatar alt="" className="h-5 w-5">
                  <AvatarImage source={{ uri: user?.farcaster?.pfp }} />
                </Avatar>
              )}
              <Text className="text-sm font-medium" id="textareaLabel">
                {user?.farcaster?.displayName}
              </Text>
              <Text className="text-xs text-secondary" id="textareaLabel">
                @{user?.farcaster?.username}
              </Text>
            </View>
            <Editor
              text={value}
              setText={setValue}
              images={images}
              setImages={setImages}
              channel={channel}
              setChannel={setChannel}
              previewComponent={
                embeds ? <CreateCastPreviewEmbeds embeds={embeds} /> : null
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function PostIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17.4 2.76L15.52 17.52C15.52 17.68 15.48 17.68 15.32 17.6L11.2 15.2C11 15.08 10.76 15.16 10.64 15.36C10.52 15.56 10.6 15.8 10.8 15.92L14.92 18.32C15.56 18.68 16.2 18.36 16.32 17.64L18.32 2.04C18.4 1.28 17.8 0.839998 17.12 1.2L1.92002 9.24C1.24002 9.6 1.24002 10.32 1.88002 10.72L5.20002 12.72C5.40002 12.84 5.64002 12.76 5.76002 12.6C5.88002 12.4 5.80002 12.16 5.64002 12.04L2.32002 10.04C2.20002 9.96 2.20002 10 2.32002 9.96L16.76 2.32L7.80002 13.84V18.36C7.80002 18.6 7.96002 18.76 8.20002 18.76C8.44002 18.76 8.60002 18.6 8.60002 18.36V14.08L17.4 2.76Z"
        fill="white"
      />
    </svg>
  );
}
