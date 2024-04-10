import { usePrivy } from "@privy-io/react-auth";
import { Stack, useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import { cn } from "~/lib/utils";
import { uploadImage } from "~/services/upload";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function CreateScreen() {
  const { submitCast, writing } = useFarcasterWrite();
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const { login, ready, user } = usePrivy();

  return (
    <SafeAreaView id="ss" className="h-full">
      <Stack.Screen
        options={{
          title: "Post",
          headerShadowVisible: false,
          headerLeft: () => {
            return (
              <View className="w-fit p-3 ">
                <Button
                  className="rounded-full bg-[#a36efe1a]"
                  size={"icon"}
                  variant={"ghost"}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <BackArrowIcon />
                </Button>
              </View>
            );
          },
          headerRight: () => {
            return (
              <View className="w-fit p-3 ">
                <Button
                  className="rounded-full web:bg-[#4C2896] web:hover:bg-[#4C2896] web:active:bg-[#4C2896]"
                  size={"icon"}
                  variant={"ghost"}
                  onPress={() => {
                    submitCast({
                      text: value,
                      embeds: images.map((item) => {
                        return { url: item };
                      }),
                    }).then(() => {
                      console.log("Cast submitted");
                      setValue("");
                      setImages([]);
                    });
                  }}
                >
                  <PostIcon />
                </Button>
              </View>
            );
          },
        }}
      />
      <View
        className="m-auto h-full w-full  space-y-2 md:w-[500px]"
        id="create-view"
      >
        {(!user?.farcaster?.signerPublicKey && (
          <View className="flex-1 p-4 pt-16">
            <Button className="rounded-lg bg-primary px-6 py-3" onPress={login}>
              <Text className="text-primary-foreground">
                Log in with farcaster
              </Text>
            </Button>
          </View>
        )) || (
          <View className="h-full" id="ad">
            <View className="flex flex-row items-center px-4 py-2">
              {user?.farcaster?.pfp && (
                <Avatar alt="" className="mr-2 h-6 w-6">
                  <AvatarImage source={{ uri: user?.farcaster?.pfp }} />
                </Avatar>
              )}
              <Text
                className="text-sm font-bold text-foreground"
                id="textareaLabel"
              >
                {user?.farcaster?.displayName}
              </Text>
              <Text className="text-sm text-secondary" id="textareaLabel">
                @{user?.farcaster?.username}
              </Text>
            </View>
            <View className="flex-grow items-center px-4">
              <Textarea
                className={cn(
                  "h-full",
                  "border-0 bg-[#fff] text-[12px] text-sm ",
                  "w-full rounded-md p-0  outline-none",
                  "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
                )}
                placeholder="Create a post..."
                value={value}
                onChangeText={setValue}
                aria-labelledby="textareaLabel"
              />
            </View>

            <View className="flex flex-col gap-2 p-4 ">
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

            <View className="flex flex-row p-4">
              <View className="flex-grow" />
              <ImageSelector
                imageUrlCallback={(url) => {
                  setImages([...images, url]);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function ImageSelector({
  imageUrlCallback,
}: {
  imageUrlCallback: (url: string) => void;
}) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    const { assets, canceled } = result;
    if (canceled) return;
    const fileData = assets?.[0];
    if (!fileData) return;
    const formData = new FormData();

    const response = await fetch(fileData.uri);
    const blob = await response.blob();

    formData.append("file", blob);

    const resp = await uploadImage(formData);
    console.log(resp.data);
    imageUrlCallback(resp.data.url);
  };

  return (
    <View>
      <Button
        onPress={pickImage}
        className="bg-secondary-foreground"
        size={"icon"}
      >
        <ImageIcon />
      </Button>
    </View>
  );
}

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M2.10347 8.88054C1.61698 8.39405 1.61698 7.60586 2.10347 7.11937L7.88572 1.33713C8.11914 1.10371 8.43573 0.972572 8.76583 0.972572C9.09594 0.972572 9.41252 1.10371 9.64594 1.33713C9.87936 1.57055 10.0105 1.88713 10.0105 2.21724C10.0105 2.54734 9.87936 2.86393 9.64594 3.09735L4.74334 7.99996L9.64594 12.9026C9.87936 13.136 10.0105 13.4526 10.0105 13.7827C10.0105 14.1128 9.87936 14.4294 9.64594 14.6628C9.41252 14.8962 9.09594 15.0273 8.76583 15.0273C8.43573 15.0273 8.11914 14.8962 7.88572 14.6628L2.10347 8.88054Z"
        fill="#4C2896"
      />
    </svg>
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

function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15.6271 1H2.87476C1.7013 1 0.75 1.95226 0.75 3.125V15.875C0.75 17.0496 1.7013 18 2.87476 18H15.6252C16.7987 18 17.75 17.0477 17.75 15.875V3.125C17.7519 1.95226 16.7987 1 15.6271 1ZM3.12161 2.35141H15.3765C15.9404 2.35141 16.3981 2.80758 16.3981 3.37209V11.9329L13.7929 8.41279C13.6638 8.23602 13.4549 8.12958 13.2308 8.12388C13.0068 8.11818 12.7922 8.21322 12.6536 8.38238L8.8579 12.9669L6.41034 10.7431C6.15969 10.515 5.77234 10.4922 5.49511 10.6898L2.10195 13.1V3.37209C2.10195 2.80948 2.55766 2.35141 3.12161 2.35141ZM15.3784 16.6467H3.12161C2.55766 16.6467 2.10005 16.1905 2.10005 15.626V14.7878C2.14182 14.7688 2.1836 14.746 2.22157 14.7175L5.86348 12.1325L8.44016 14.4742C8.58637 14.6072 8.78194 14.6737 8.98132 14.6604C9.18069 14.6471 9.36488 14.554 9.4902 14.4038L13.1815 9.94667L16.1189 13.9192C16.193 14.0199 16.2917 14.094 16.3999 14.1434V15.626C16.3999 16.1886 15.9423 16.6467 15.3784 16.6467Z"
        fill="#4C2896"
      />
      <path
        d="M6.66016 8.28125C7.7793 8.28125 8.69141 7.36914 8.69141 6.25C8.69141 5.13086 7.7793 4.21875 6.66016 4.21875C5.54102 4.21875 4.62891 5.13086 4.62891 6.25C4.62891 7.36914 5.54102 8.28125 6.66016 8.28125ZM6.66016 5.625C7.00586 5.625 7.28516 5.9043 7.28516 6.25C7.28516 6.5957 7.00586 6.875 6.66016 6.875C6.31445 6.875 6.03516 6.5957 6.03516 6.25C6.03516 5.9043 6.3125 5.625 6.66016 5.625Z"
        fill="#4C2896"
      />
    </svg>
  );
}
