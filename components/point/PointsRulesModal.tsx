import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Atom } from "../common/Icons";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import { Separator } from "../ui/separator";
import useUserAction from "~/hooks/user/useUserAction";
import { useRouter } from "expo-router";
import { usePrivy } from "@privy-io/react-auth";
import useAuth from "~/hooks/user/useAuth";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import PlatformSharingModal from "../platform-sharing/PlatformSharingModal";
import { useState } from "react";
import {
  getAppShareTextWithTwitter,
  getAppShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import {
  getAppFrameLink,
  getAppWebsiteLink,
} from "~/utils/platform-sharing/link";

export default function PointsRulesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login } = usePrivy();
  const { authenticated } = useAuth();
  const { signerPublicKey } = useFarcasterAccount();
  const { prepareWrite: connectFarcaster } = useFarcasterWrite();
  const router = useRouter();
  const { actionPointConfig } = useUserAction();
  const {
    View: { unit: viewUnit },
    Like: { unit: likeUnit },
    Tips: { unit: tipsUnit },
    ConnectFarcaster: { unit: connectFarcasterUnit },
    BuyChannelShare: { unit: buyChannelShareUnit },
    Invite: { unit: inviteUnit },
    SwapToken: { unit: swapTokenUnit },
  } = actionPointConfig;
  const { totalPoints } = useUserTotalPoints();

  const getPointsText = (unit: number) => {
    return unit > 1 ? `${unit} points` : `${unit} point`;
  };

  const [openShare, setOpenShare] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <DialogHeader>
          <Text className=" text-base font-medium">Point</Text>
        </DialogHeader>
        <View className="flex-row items-center gap-2">
          <Atom color="#FFFFFF" className=" h-7 w-7" />
          <Text className=" text-2xl text-white">{totalPoints}</Text>
        </View>
        <Separator decorative className=" my-5" />
        <View className="max-w-s flex-col gap-5 ">
          <RuleItem
            text="Connect Farcaster"
            pointsText={getPointsText(connectFarcasterUnit)}
            btnText={signerPublicKey ? "Connected" : "Connect"}
            btnDisabled={!!signerPublicKey}
            onBtnPress={() => {
              onOpenChange(false);
              if (!authenticated) {
                login();
                return;
              }
              connectFarcaster();
            }}
          />
          <RuleItem
            text="Buy channel shares"
            pointsText={`${getPointsText(buyChannelShareUnit)} per purchase`}
            btnText="Trade"
            onBtnPress={() => {
              onOpenChange(false);
              router.navigate("trade/shares");
            }}
          />
          <RuleItem
            text="Swap Tokens"
            pointsText={`One-time swap of token worth 30 USD, earn ${getPointsText(swapTokenUnit)}`}
            btnText="Trade"
            onBtnPress={() => {
              onOpenChange(false);
              router.navigate("trade/tokens" as never);
            }}
          />
          <RuleItem
            text="Invite"
            pointsText={`${getPointsText(inviteUnit)} each new user`}
            btnText="Share"
            onBtnPress={() => {
              // onOpenChange(false);
              setOpenShare(true);
            }}
          />
          <RuleItem
            text="Tips"
            pointsText={`${getPointsText(tipsUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange(false);
              router.navigate("/");
            }}
          />
          <RuleItem
            text="View casts"
            pointsText={`${getPointsText(viewUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange(false);
              router.navigate("/");
            }}
          />
          <RuleItem
            text="Like"
            pointsText={`${getPointsText(likeUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange(false);
              router.navigate("/");
            }}
          />
        </View>
        <PlatformSharingModal
          open={openShare}
          onOpenChange={(open) => setOpenShare(open)}
          twitterText={getAppShareTextWithTwitter()}
          warpcastText={getAppShareTextWithWarpcast()}
          websiteLink={getAppWebsiteLink()}
          frameLink={getAppFrameLink()}
          navigateToCreatePageAfter={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function RuleItem({
  text,
  pointsText,
  btnDisabled,
  btnText,
  onBtnPress,
  className,
  ...props
}: ViewProps & {
  text: string;
  pointsText: string;
  btnDisabled?: boolean;
  btnText: string;
  onBtnPress: () => void;
}) {
  return (
    <View
      className={cn(" flex-row items-center justify-between", className)}
      {...props}
    >
      <View className=" flex-1 flex-col gap-3">
        <Text className=" text-base font-bold leading-normal text-primary-foreground">
          {text}
        </Text>
        <Text className=" text-base leading-normal text-secondary">
          {pointsText}
        </Text>
      </View>
      <Button
        variant={"secondary"}
        className=" min-w-20"
        onPress={onBtnPress}
        disabled={btnDisabled}
      >
        <Text>{btnText}</Text>
      </Button>
    </View>
  );
}
