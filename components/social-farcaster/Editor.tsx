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
import WarpcastChannelPicker from "~/components/social-farcaster/WarpcastChannelPicker";
import { WarpcastChannel } from "~/services/community/api/community";
import { FarCast } from "~/services/farcaster/types";
import { Card, CardContent } from "../ui/card";
import FCast from "./FCast";

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
    <View className="flex w-full flex-grow gap-5 border-secondary">
      <View className="flex-grow items-center">
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
        className="rounded-md bg-[#a36efe1a]"
        size={"icon"}
      >
        <ImageIcon />
      </Button>
    </View>
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
