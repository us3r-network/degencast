import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ImageSourcePropType, View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button, ButtonProps } from "../ui/button";
import { Image } from "react-native";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { useNavigation } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { openTwitterCreateTweet } from "~/utils/platform-sharing/twitter";
import { openWarpcastCreateCast } from "~/utils/platform-sharing/warpcast";
import useUserAction from "~/hooks/user/useUserAction";
import Toast from "react-native-toast-message";

export type ShareProps = {
  text?: string;
  twitterText?: string;
  warpcastText?: string;
  warpcastChannelId?: string;
  websiteLink?: string;
  frameLink?: string;
  navigateToCreatePageAfter?: () => void;
};

export default function PlatformSharingModal({
  text,
  twitterText,
  warpcastText,
  websiteLink,
  warpcastChannelId,
  frameLink,
  open,
  showPoints = true,
  onOpenChange,
  navigateToCreatePageAfter,
}: ShareProps & {
  open: boolean;
  showPoints?: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { actionPointConfig } = useUserAction();
  const {
    Invite: { unit: inviteUnit },
  } = actionPointConfig;
  const navigation = useNavigation();
  const { signerPublicKey } = useFarcasterAccount();
  const onCreateCast = async () => {
    const createText = warpcastText || text || "";
    if (!signerPublicKey) {
      openWarpcastCreateCast(createText, frameLink);
    } else {
      onOpenChange(false);
      navigation.navigate(
        ...([
          "create",
          {
            text: createText,
            embeds: [frameLink],
            channelId: warpcastChannelId || "",
          },
        ] as never),
      );
      navigateToCreatePageAfter?.();
    }
  };

  const onTwitterShare = () => {
    openTwitterCreateTweet(twitterText || text || "", websiteLink);
  };

  const onCopy = async () => {
    if (websiteLink) await Clipboard.setStringAsync(websiteLink);
    onOpenChange(false);
    Toast.show({
      type: "success",
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
          {warpcastText && (
            <ShareButton
              iconSource={require("~/assets/images/warpcast.png")}
              text="Share & Earn"
              points={showPoints ? inviteUnit : 0}
              onPress={onCreateCast}
            />
          )}
          {twitterText && (
            <ShareButton
              iconSource={require("~/assets/images/x.png")}
              text="Share & Earn"
              points={showPoints ? inviteUnit : 0}
              onPress={onTwitterShare}
            />
          )}
          {websiteLink && (
            <ShareButton
              iconSource={require("~/assets/images/link.png")}
              text="Copy"
              onPress={onCopy}
            />
          )}
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
        {Number(points) > 0 && (
          <Text className=" mt-1 text-xs text-secondary">+{points} Points</Text>
        )}
      </View>
    </Button>
  );
}
