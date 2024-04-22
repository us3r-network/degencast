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
import { View, Text, Image, Platform, Linking } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function EmbedFrame({
  url,
  data,
  cast,
}: {
  url: string;
  data: Frame;
  cast: FarCast;
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
        alert("Not supported yet");
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
    <View className="w-full overflow-hidden rounded-xl border border-secondary ">
      <AspectRatio ratio={ratio}>
        <Image
          source={{ uri: frameData.image }}
          style={{ width: "100%", height: "100%" }}
        />
      </AspectRatio>
      <View className="p-2">
        {(frameData.inputText && (
          <div className="mt-2 px-3">
            <Input
              placeholder={frameData.inputText}
              value={text}
              onChangeText={(v) => setText(v)}
            />
          </div>
        )) ||
          null}
        <View
          className={cn(
            "grid w-full items-center gap-2 ",
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
                <Text className={"color-white"}>{button.label}</Text>
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
}
