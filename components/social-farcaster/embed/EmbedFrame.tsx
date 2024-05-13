import {
  Frame,
  FrameButton,
  FrameButtonLink,
  FrameButtonsType,
} from "frames.js";
import {
  FarcasterWithMetadata,
  useExperimentalFarcasterSigner,
  usePrivy,
  useLinkAccount,
} from "@privy-io/react-auth";

import { FarCast } from "~/services/farcaster/types";
import { View, Image, Platform, Linking, Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import Toast from "react-native-toast-message";

export default function EmbedFrame({
  url,
  data,
  cast,
}: {
  url: string;
  data: Frame;
  cast?: FarCast;
}) {
  const { requestFarcasterSigner } = useExperimentalFarcasterSigner();
  const { user, login, ready, authenticated } = usePrivy();

  const [frameData, setFrameData] = useState<Frame>(data);
  const [text, setText] = useState("");

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

  // "link" | "post" | "post_redirect" | "mint" | "tx"
  const frameBtnAction = useCallback(
    async (index: number, btn: FrameButton) => {
      if (btn.action === "link") {
        Linking.openURL(btn.target);
        return;
      }
      if (btn.action === "mint") {
        Linking.openURL(url);
        return;
      }
      if (Platform.OS === "web") {
        Toast.show({
          type: "info",
          text1: "Not supported yet",
        });
      }
      console.log("not support yet TODO", btn.action);
    },
    [frameData],
  );

  const ratio = useMemo(() => {
    if (frameData.imageAspectRatio) {
      const w_h = frameData.imageAspectRatio.split(":");
      return Number(w_h[0]) / Number(w_h[1]);
    }
    return 16 / 8;
  }, [frameData]);

  useEffect(() => {
    setFrameData(data);
  }, [data]);

  // console.log("farcasterAccount", farcasterAccount);

  // console.log("EmbedFrame", frameData, frameData.image);
  return (
    <View className="w-full overflow-hidden rounded-[10px] border border-secondary ">
      <AspectRatio ratio={ratio}>
        <Pressable
          className="h-full w-full"
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(url);
          }}
        >
          <Image
            source={{ uri: frameData.image }}
            style={{ width: "100%", height: "100%" }}
          />
        </Pressable>
      </AspectRatio>
      <View className="p-3">
        {(frameData.inputText && (
          <View className="py-3">
            <Input
              className=" text-secondary-foreground"
              placeholderClassName=" text-secondary-foreground"
              placeholder={frameData.inputText}
              value={text}
              onChangeText={(v) => setText(v)}
            />
          </View>
        )) ||
          null}
        <View
          className={cn(
            "grid w-full items-center gap-3 ",
            (frameData.buttons || []).length % 2 === 0
              ? "grid-cols-2"
              : `grid-cols-${frameData.buttons?.length}`,
          )}
        >
          {(frameData.buttons || []).map((button, idx) => {
            if (!button.label) return null;
            return (
              <Button
                key={idx}
                variant={"secondary"}
                onPress={async (e) => {
                  e.stopPropagation();
                  await frameBtnAction(idx, button);
                }}
              >
                <Text>{button.label}</Text>
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
}
