import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Image } from "expo-image";
import { AspectRatio } from "../ui/aspect-ratio";
import getCastHex from "~/utils/farcaster/getCastHex";
import { useEffect, useState } from "react";
import { Loading } from "../common/Loading";
import { imgLinkToBase64 } from "~/utils/image";

export default function FCastMintNftModal({
  cast,
  open,
  onOpenChange,
}: {
  cast: FarCast;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const castHex = getCastHex(cast);
  const originImgUrl = `https://client.warpcast.com/v2/cast-image?castHash=0x${castHex}`;
  const [imgLoading, setImgLoading] = useState(true);
  const [imgBase64, setImgBase64] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const base64 = await imgLinkToBase64(originImgUrl);
        setImgBase64(base64);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [originImgUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <DialogHeader>
          <Text>Mint & Share</Text>
        </DialogHeader>
        <View className="flex w-full flex-col gap-5 sm:min-w-[390px] ">
          <View className="">
            <AspectRatio ratio={1}>
              <Image
                onLoadStart={() => {
                  setImgLoading(true);
                }}
                onLoadEnd={() => {
                  setImgLoading(false);
                }}
                source={{ uri: originImgUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </AspectRatio>
            {imgLoading ? (
              <View className=" absolute h-full w-full flex-row items-center justify-center">
                <Loading />
              </View>
            ) : null}
          </View>
          <Button
            className="font-bold text-white"
            variant={"secondary"}
            disabled={!imgBase64}
            onPress={() => {}}
          >
            <Text>Mint Cast & Share</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
