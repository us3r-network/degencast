import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import GoBackButton from "~/components/common/GoBackButton";
import CreateCastPreviewEmbeds from "~/components/social-farcaster/CreateCastPreviewEmbeds";
import Editor, { SIGNATURE_TEXT } from "~/components/social-farcaster/Editor";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { DEGENCAST_WEB_HOST } from "~/constants";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";
import useCastCollection from "~/hooks/social-farcaster/cast-nft/useCastCollection";
import useCreateCastPreview from "~/hooks/social-farcaster/useCreateCastPreview";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useAuth from "~/hooks/user/useAuth";
import useUserAction from "~/hooks/user/useUserAction";
import { WarpcastChannel } from "~/services/community/api/community";
import { UserActionName } from "~/services/user/types";

const HomeChanel = {
  id: "",
  name: "Home",
  url: "",
  imageUrl: "",
  createdAt: 0,
} as WarpcastChannel;
export default function CreateScreen() {
  const { sharingCastMint, clearSharingCastMint } = useCastCollection();
  const { submitUserAction } = useUserAction();
  const localSearchParams = useLocalSearchParams();
  // console.log("localSearchParams", localSearchParams);
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
  const { currFid, farcasterAccount } = useFarcasterAccount();
  const { login, ready } = useAuth();

  const { upsertCreateCastPreviewData } = useCreateCastPreview();
  return (
    <SafeAreaView style={{ flex: 1 }} className="h-screen bg-white">
      <Stack.Screen
        options={{
          header: () => (
            <View
              className="flex w-screen flex-row items-center justify-between bg-white"
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
                  {currFid && (
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
                          parentUrl: channel.url,
                        };

                        // 乐观发布
                        setTimeout(() => {
                          upsertCreateCastPreviewData({
                            posting: true,
                            cast: data as any,
                            castHash: "",
                          });
                          Toast.show({
                            type: "postPreviewToast",
                            visibilityTime: 3000,
                          });
                          navigation.goBack();
                        }, 300);

                        let submitData = data;
                        // 包含degencast签名, 加embed frame
                        if (data.text.includes(SIGNATURE_TEXT)) {
                          const embeds = data?.embeds || [];
                          const newEmbeds = [
                            ...embeds,
                            {
                              url:
                                DEGENCAST_WEB_HOST || "https://degencast.wtf",
                            },
                          ];
                          submitData = {
                            ...data,
                            embeds: newEmbeds,
                          };
                        }

                        const result = await submitCast(submitData);

                        if (result?.hash) {
                          // 真实发布完，更新乐观发布数据
                          upsertCreateCastPreviewData({
                            posting: false,
                            cast: data as any,
                            castHash: result?.hash,
                          });

                          setValue("");
                          setImages([]);
                          setChannel(HomeChanel);
                          setPosting(false);

                          // 包含degencast签名, 加积分
                          if (data.text.includes(SIGNATURE_TEXT)) {
                            submitUserAction({
                              action: UserActionName.PostingSignature,
                              castHash: result?.hash,
                            });
                          }

                          const { castHex, url, mintInfo } =
                            sharingCastMint || {};
                          if (
                            castHex &&
                            url &&
                            mintInfo &&
                            embeds.length > 0 &&
                            !!embeds.find((item) => item.url === url)
                          ) {
                            submitUserAction({
                              action: UserActionName.MintCast,
                              castHash: castHex,
                              data: mintInfo,
                            });
                            clearSharingCastMint();
                          }
                          // navigation.goBack();
                        } else {
                          upsertCreateCastPreviewData({
                            posting: false,
                            cast: data as any,
                            castHash: "",
                          });
                          setPosting(false);
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
        className="mx-auto h-full w-screen p-4 pt-0 md:max-w-screen-sm"
        id="create-view"
      >
        {(!currFid && (
          <View className="flex-1 p-4 pt-16">
            <Button
              className="rounded-lg bg-primary px-6 py-3"
              onPress={() => login()}
            >
              <Text className="text-primary-foreground">
                Log in with farcaster
              </Text>
            </Button>
          </View>
        )) || (
          <View className="h-full w-full" id="ad">
            <View className="mb-5 flex flex-row items-center gap-1">
              {farcasterAccount?.pfp && (
                <Avatar alt="" className="h-5 w-5">
                  <AvatarImage source={{ uri: farcasterAccount?.pfp }} />
                </Avatar>
              )}
              <Text className="text-sm font-medium" id="textareaLabel">
                {farcasterAccount?.displayName}
              </Text>
              <Text className="text-xs text-secondary" id="textareaLabel">
                @{farcasterAccount?.username}
              </Text>
            </View>
            <View className="w-full flex-1">
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
