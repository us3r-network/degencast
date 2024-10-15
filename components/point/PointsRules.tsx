import {
  View,
  ViewProps,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
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
import { SECONDARY_COLOR } from "~/constants";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import { Loading } from "../common/Loading";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { Avatar, AvatarImage } from "../ui/avatar";

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
    VoteCast: { unit: voteCastUnit },
    PostingSignature: { unit: postingSignatureUnit },
  } = actionPointConfig;
  const { loading, rejected, loadMyInvitationCodes, invitationCodes } =
    useUserInvitationCodes();
  useEffect(() => {
    if (loading || rejected || invitationCodes.length > 0) return;
    loadMyInvitationCodes();
  }, [loading, rejected, invitationCodes]);
  const showInviteCode = invitationCodes.find((item) => !item?.isUsed);
  return (
    <View className="flex flex-col gap-4">
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
            <ActivityIndicator size={20} color={SECONDARY_COLOR} />
          ) : !!showInviteCode ? (
            <InviteCodeCopy inviteCode={showInviteCode.code} />
          ) : null
        }
      />
      <RuleItem title="Add Farcaster signer" points={connectFarcasterUnit} />
      {Platform.OS === "web" ? <AddFarcasterSigner /> : null}
      <Separator className=" color-[#E0E0E0]" />
      <RuleItem
        title="Degencast posting signature"
        points={postingSignatureUnit}
        unitText="cast"
      />
      <RuleItem title="Like cast" points={voteCastUnit} unitText="cast" />
      <RuleItem title="Mint cast" points={mintCastUnit} unitText="cast" />
    </View>
  );
}

function RuleItem({
  className,
  title,
  points,
  unitText,
  description,
  content,
  showHelpIcon,
  onHelpPress,
  ...props
}: ViewProps & {
  title: string;
  points: number;
  unitText?: string;
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
        <Text className="font-bold">{title}</Text>
        <Text className="text-secondary">
          {points === POINTS_INFINITE_VALUE ? "+∞" : `+${points}`}
          {unitText ? `/${unitText}` : ""}
        </Text>
      </View>
      {content}
      {description && (
        <Text className=" text-sm font-normal text-[#9BA1AD]">
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

export function InviteCodeCopy({
  inviteCode,
  onCopyAfter,
}: {
  inviteCode: string | number;
  onCopyAfter?: () => void;
}) {
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
        onCopyAfter?.();
      }}
    >
      <Text className=" text-xs text-secondary active:text-secondary web:hover:text-secondary">
        {inviteCode}
      </Text>
      <Copy className="size-4 stroke-secondary" />
    </Button>
  );
}

export function AddFarcasterSigner() {
  const { hasSigner, requesting, requestSigner } = useFarcasterSigner();
  const { farcasterAccount } = useFarcasterAccount();
  if (!hasSigner) {
    return (
      <Button
        variant="secondary"
        disabled={requesting}
        onPress={() => requestSigner()}
        className="h-8 w-full"
      >
        {requesting ? <Loading /> : <Text>Connect</Text>}
      </Button>
    );
  }
  return (
    <View className="flex flex-row items-center gap-2">
      {farcasterAccount?.pfp && (
        <Avatar alt="" className="h-8 w-8">
          <AvatarImage source={{ uri: farcasterAccount?.pfp }} />
        </Avatar>
      )}
      <Text className="text-base font-medium">
        {farcasterAccount?.displayName}
      </Text>
      <Check className=" ml-auto size-6 stroke-[#00D1A7]" />
    </View>
  );
}
