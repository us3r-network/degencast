import { ScrollView, View, ViewProps, Image } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import { Separator } from "../ui/separator";
import useUserAction from "~/hooks/user/useUserAction";
import { useRouter } from "expo-router";
import useAuth from "~/hooks/user/useAuth";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
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
import { Check } from "../common/Icons";

export function PointsRules({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const { authenticated, login } = useAuth();
  const { signerPublicKey, currFid } = useFarcasterAccount();
  const { requestSigner } = useFarcasterSigner();
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
    MintCast: { unit: mintCastUnit },
  } = actionPointConfig;
  const { totalPoints } = useUserTotalPoints();

  const getPointsText = (unit: number) => {
    return `${unit} $CAST`;
    // return unit > 1 ? `${unit} points` : `${unit} point`;
  };

  const [openShare, setOpenShare] = useState(false);
  return (
    <>
      <View className="flex-row items-center gap-2">
        <Image
          source={require("~/assets/images/wand-sparkles-white.png")}
          style={{
            width: 28,
            height: 28,
            resizeMode: "contain",
          }}
        />
        <Text className=" text-2xl">{totalPoints}</Text>
      </View>
      <Separator className="my-2 bg-secondary/10" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className="max-h-[50vh]"
      >
        <View className="max-w-s flex-col gap-4">
          <RuleItem
            text="Connect Farcaster"
            pointsText={getPointsText(connectFarcasterUnit)}
            btnText={"Connect"}
            completed={!!signerPublicKey}
            onBtnPress={() => {
              onOpenChange?.(false);
              if (!authenticated) {
                login();
                return;
              }
              requestSigner();
            }}
          />
          <RuleItem
            text="Buy channel shares"
            pointsText={`${getPointsText(buyChannelShareUnit)} per purchase`}
            btnText="Coming Soon"
            onBtnPress={() => {
              // onOpenChange(false);
              // router.navigate("trade/shares");
            }}
          />
          <RuleItem
            text="Swap Tokens"
            pointsText={`One-time swap of token worth 30 USD, earn ${getPointsText(swapTokenUnit)}`}
            btnText="Trade"
            onBtnPress={() => {
              onOpenChange?.(false);
              router.navigate("channels/tokens" as never);
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
              onOpenChange?.(false);
              router.navigate("/");
            }}
          />
          <RuleItem
            text="View casts"
            pointsText={`${getPointsText(viewUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange?.(false);
              router.navigate("/");
            }}
          />
          <RuleItem
            text="Mint casts"
            pointsText={`${getPointsText(mintCastUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange?.(false);
              router.navigate("/");
            }}
          />
          <RuleItem
            text="Like"
            pointsText={`${getPointsText(likeUnit)} for each`}
            btnText="Explore"
            onBtnPress={() => {
              onOpenChange?.(false);
              router.navigate("/");
            }}
          />
        </View>
      </ScrollView>

      <PlatformSharingModal
        open={openShare}
        onOpenChange={(open) => setOpenShare(open)}
        twitterText={getAppShareTextWithTwitter()}
        warpcastText={getAppShareTextWithWarpcast()}
        websiteLink={getAppWebsiteLink({
          fid: currFid,
        })}
        warpcastEmbeds={[
          getAppFrameLink({
            fid: currFid,
          }),
        ]}
        navigateToCreatePageAfter={() => {
          onOpenChange?.(false);
        }}
      />
    </>
  );
}

function RuleItem({
  text,
  pointsText,
  btnDisabled,
  btnText,
  completed,
  onBtnPress,
  className,
  ...props
}: ViewProps & {
  text: string;
  pointsText: string;
  btnDisabled?: boolean;
  btnText: string;
  completed?: boolean;
  onBtnPress: () => void;
}) {
  return (
    <View
      className={cn("flex-row items-center justify-between", className)}
      {...props}
    >
      <View className="flex-1 flex-col">
        <Text className=" text-base font-medium leading-normal">{text}</Text>
        <Text className=" text-base leading-normal text-secondary">
          {pointsText}
        </Text>
      </View>
      {completed ? (
        <Check className=" size-5 stroke-[#00D1A7]" />
      ) : (
        <Button
          variant={"secondary"}
          className=" min-w-20"
          onPress={onBtnPress}
          disabled={btnDisabled}
        >
          <Text>{btnText}</Text>
        </Button>
      )}
    </View>
  );
}
