import { View, ViewProps, Pressable, ActivityIndicator } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { Separator } from "../ui/separator";
import useUserAction from "~/hooks/user/useUserAction";
import { AlertCircle, Check, Copy } from "../common/Icons";
import React, { useEffect, useState } from "react";
import useUserInvitationCodes from "~/hooks/user/useUserInvitationCodes";
import { Button } from "../ui/button";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import TipAllocationModal from "./TipAllocationModal";

const POINTS_INFINITE_VALUE = 999999999;
export function PointsRules() {
  const { actionPointConfig } = useUserAction();
  const {
    View: { unit: viewUnit },
    ViewChannel: { unit: viewChannelUnit, dailyLimit: viewChannelDailyLimit },
    Like: { unit: likeUnit },
    Tips: { unit: tipsUnit },
    ConnectFarcaster: { unit: connectFarcasterUnit },
    BuyChannelShare: { unit: buyChannelShareUnit },
    Invite: { unit: inviteUnit },
    SwapToken: { unit: swapTokenUnit },
    MintCast: { unit: mintCastUnit },
  } = actionPointConfig;
  const { loading, rejected, loadMyInvitationCodes, invitationCodes } =
    useUserInvitationCodes();
  useEffect(() => {
    if (loading || rejected || invitationCodes.length > 0) return;
    loadMyInvitationCodes();
  }, [loading, rejected, invitationCodes]);
  const showInviteCode = invitationCodes.find((item) => !item?.isUsed);
  const [openTipAllocation, setOpenTipAllocation] = useState(false);
  return (
    <RuleGroups>
      <RuleGroup title="Point">
        <RuleItem
          title="Invite a new Farcaster user"
          points={inviteUnit}
          description={
            loading
              ? ""
              : !!showInviteCode
                ? ""
                : "No more invitation codes for you now"
          }
          content={
            loading ? (
              <ActivityIndicator size={20} color={"#A36EFE"} />
            ) : !!showInviteCode ? (
              <InviteCodeCopy inviteCode={showInviteCode.code} />
            ) : null
          }
        />
        <RuleItem
          title="Channel Rewards"
          points={POINTS_INFINITE_VALUE}
          description="Curve up channel reward pool"
        />
        <RuleItem
          title="To tip and to be tipped"
          points={POINTS_INFINITE_VALUE}
          description="Allocate tip allowances on a pro rata basis"
          showHelpIcon
          onHelpPress={() => {
            setOpenTipAllocation(true);
          }}
        />
        <TipAllocationModal
          open={openTipAllocation}
          onOpenChange={setOpenTipAllocation}
        />
      </RuleGroup>
      <RuleGroup title="Daily Allowance">
        <RuleItem
          title="Hold the Channel Badges"
          points={POINTS_INFINITE_VALUE}
          content={
            <>
              <Text className=" text-sm font-normal text-secondary">
                Hold the longer, the more allowance growth
              </Text>
              <Text className=" text-sm font-normal text-secondary">
                void after sale
              </Text>
            </>
          }
        />
        <RuleItem
          title="Explore Degencast"
          points={viewChannelUnit * (viewChannelDailyLimit || 0)}
          description={`Browse ${viewChannelDailyLimit} trending channels daily`}
        />
        <RuleItem
          title="Swap tokens"
          points={swapTokenUnit}
          description={`One-time swap of token worth 30 USD`}
        />
        <RuleItem
          title="Mint casts"
          points={mintCastUnit}
          description={`Mint casts to NFTs`}
        />
      </RuleGroup>
    </RuleGroups>
  );
}

function RuleGroups({ className, children, ...props }: ViewProps) {
  const childrenArray = React.Children.toArray(children);
  return (
    <View className={cn("flex w-full flex-col", className)} {...props}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <Separator className="my-8 bg-primary/10" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
function RuleGroup({
  title,
  className,
  children,
  ...props
}: ViewProps & {
  title: string;
}) {
  return (
    <View className={cn("flex w-full flex-col gap-4", className)} {...props}>
      <Text className="font-bold text-black">{title}</Text>
      {children}
    </View>
  );
}

function RuleItem({
  className,
  title,
  points,
  description,
  content,
  showHelpIcon,
  onHelpPress,
  ...props
}: ViewProps & {
  title: string;
  points: number;
  description?: string;
  content?: React.ReactNode;
  showHelpIcon?: boolean;
  onHelpPress?: () => void;
}) {
  return (
    <View className={cn("flex w-full flex-col gap-3", className)} {...props}>
      <View
        className={cn(
          "flex flex-row items-center justify-between gap-2",
          className,
        )}
        {...props}
      >
        <Text>{title}</Text>
        <Text className="text-secondary">
          {points === POINTS_INFINITE_VALUE ? "+∞" : `+${points}`}
        </Text>
      </View>
      {content}
      {description && (
        <Text className=" text-sm font-normal text-secondary">
          {description}{" "}
          {showHelpIcon && (
            <Pressable
              className=" inline-block align-middle"
              onPress={() => {
                onHelpPress?.();
              }}
            >
              <AlertCircle className="size-4 stroke-secondary" />
            </Pressable>
          )}
        </Text>
      )}
    </View>
  );
}

function InviteCodeCopy({ inviteCode }: { inviteCode: string | number }) {
  return (
    <Button
      variant="outline"
      className="flex flex-row items-center justify-between bg-muted active:bg-muted web:hover:bg-muted"
      style={{
        backgroundColor: "rgba(163, 110, 254, 0.10)",
      }}
      onPress={async () => {
        if (inviteCode) await Clipboard.setStringAsync(String(inviteCode));
        Toast.show({
          type: "success",
          text1: "Invitation code copied to clipboard!",
        });
      }}
    >
      <Text className=" text-xs text-secondary active:text-secondary web:hover:text-secondary">
        {inviteCode}
      </Text>
      <Copy className="size-4 stroke-secondary" />
    </Button>
  );
}
