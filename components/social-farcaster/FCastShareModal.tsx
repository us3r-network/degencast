import { FarCast } from "~/services/farcaster/types";
import * as Clipboard from "expo-clipboard";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ImageSourcePropType, View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button, ButtonProps } from "../ui/button";
import { Image } from "react-native";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import useAuth from "~/hooks/user/useAuth";
import { openTwitterCreateTweet } from "~/utils/platform-sharing/twitter";
import { getCastDetailWebsiteLink } from "~/utils/platform-sharing/link";
import useUserAction from "~/hooks/user/useUserAction";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import Toast from "react-native-toast-message";
import { getCastShareTextWithTwitter } from "~/utils/platform-sharing/text";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";

export default function FCastShareModal({
  cast,
  open,
  onOpenChange,
}: {
  cast: FarCast | NeynarCast;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { currFid } = useFarcasterAccount();
  const { actionPointConfig } = useUserAction();
  const {
    Invite: { unit: inviteUnit },
  } = actionPointConfig;
  const castHex = getCastHex(cast);
  const { login, ready, authenticated } = useAuth();
  const { recast, removeRecast, recasted, recastCount } =
    useFarcasterRecastAction({ cast });
  const onRecast = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (recasted) {
      // removeRecast();
      // alert("recast removed");
      Toast.show({
        type: "info",
        text1: "Already recasted!",
      });
    } else {
      recast();
      onOpenChange(false);
      Toast.show({
        type: "success",
        text1: "Recast successfully!",
      });
    }
  };

  const castWebLink = getCastDetailWebsiteLink(castHex, {
    fid: currFid,
  });

  const onTwitterShare = () => {
    openTwitterCreateTweet(getCastShareTextWithTwitter(), castWebLink);
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(castWebLink);
    onOpenChange(false);
    Toast.show({
      type: "info",
      text1: "Link copied to clipboard!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <DialogHeader>
          <Text>Share</Text>
        </DialogHeader>
        <View className="max-w-s flex flex-row gap-5 ">
          <ShareButton
            iconSource={require("~/assets/images/warpcast.png")}
            text="Recast"
            onPress={onRecast}
          />
          {/* <ShareButton
            iconSource={require("~/assets/images/warpcast.png")}
            text="Quote"
            points={999}
          /> */}
          <ShareButton
            iconSource={require("~/assets/images/x.png")}
            text="Share"
            points={inviteUnit}
            onPress={onTwitterShare}
          />
          <ShareButton
            iconSource={require("~/assets/images/link.png")}
            text="Copy"
            onPress={onCopy}
          />
        </View>
      </DialogContent>
    </Dialog>
  );
}

function ShareButton({
  iconSource,
  text,
  points,
  className,
  ...props
}: ButtonProps & {
  iconSource: ImageSourcePropType;
  text: string;
  points?: number;
}) {
  return (
    <Button
      className={cn(
        " h-28 flex-1 flex-col items-center gap-3 bg-white p-3",
        className,
      )}
      {...props}
    >
      <Image source={iconSource} style={{ width: 50, height: 50 }} />
      <View className=" flex-1 flex-col items-center justify-center">
        <Text className=" text-xs text-black">{text}</Text>
        {points && (
          <Text className=" mt-1 text-xs text-secondary">+{points} $CAST</Text>
        )}
      </View>
    </Button>
  );
}
