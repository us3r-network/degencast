import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { ImageSourcePropType, View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button, ButtonProps } from "../ui/button";
import { Image } from "react-native";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import useAuth from "~/hooks/user/useAuth";
import { usePrivy } from "@privy-io/react-auth";

export default function FCastShareModal({
  cast,
  open,
  onOpenChange,
}: {
  cast: FarCast;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login } = usePrivy();
  const { authenticated } = useAuth();
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
      alert("already recasted");
    } else {
      recast();
      alert("recast created");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <View className="max-w-s flex flex-row gap-5 ">
          <ShareButton
            iconSource={require("~/assets/images/warpcast.png")}
            text="Recast"
            points={999}
            onPress={onRecast}
          />
          <ShareButton
            iconSource={require("~/assets/images/warpcast.png")}
            text="Quote"
            points={999}
          />
          <ShareButton
            iconSource={require("~/assets/images/x.png")}
            text="Share"
            points={999}
          />
          <ShareButton
            iconSource={require("~/assets/images/link.png")}
            text="Copy"
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
          <Text className=" mt-1 text-xs text-secondary">+{points} Points</Text>
        )}
      </View>
    </Button>
  );
}
