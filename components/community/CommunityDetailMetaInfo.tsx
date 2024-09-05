import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import CommunityJoinButton, {
  CommunityJoinIconButton,
} from "./CommunityJoinButton";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "../common/Icons";
import { Button } from "../ui/button";
import { Link } from "expo-router";
import { ChannelDetailLaunchProgress } from "./LaunchProgress";
import useLoadAttentionTokenInfo from "~/hooks/community/useLoadAttentionTokenInfo";
import { Separator } from "../ui/separator";
import useATTNftPrice from "~/hooks/trade/useATTNftPrice";
import { formatUnits } from "viem";
import useATTNftInfo from "~/hooks/trade/useATTNftInfo";
import { TradeButton } from "../trade/TradeButton";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(Number(value));
};
export default function CommunityDetailMetaInfo({
  communityInfo,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityData;
}) {
  const {
    name,
    logo,
    description,
    memberInfo,
    hostUserData,
    tokenInitiatorUserData,
  } = communityInfo;
  const { totalNumber, newPostNumber } = memberInfo || {};

  return (
    <View className={cn("w-full flex-row gap-3", className)} {...props}>
      <Avatar alt={name || ""} className="size-20">
        <AvatarImage source={{ uri: logo || "" }} />
        <AvatarFallback>
          <Text className="text-sm font-bold">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 flex-col gap-3">
        <Text className="text-base font-bold leading-none text-primary-foreground">
          {name}
        </Text>
        <View className="flex-row items-end gap-3">
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              {displayValue(totalNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Members
            </Text>
          </View>
          <View className="flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-primary-foreground">
              {displayValue(newPostNumber || 0)}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              Casts
            </Text>
          </View>
        </View>
        {!!hostUserData && (
          <Link href={`/u/${hostUserData.fid}`} className="flex flex-row gap-1">
            <Text className="text-sm font-medium leading-none text-secondary">
              Host
            </Text>
            <Text className="text-sm font-medium leading-none text-primary-foreground hover:underline">
              @{hostUserData?.username}
            </Text>
          </Link>
        )}
        {!!tokenInitiatorUserData && (
          <Link
            href={`/u/${tokenInitiatorUserData.fid}`}
            className="flex flex-row gap-1"
          >
            <Text className="text-sm font-medium leading-none text-secondary">
              Curation Token Initiator
            </Text>
            <Text className="text-sm font-medium leading-none text-primary-foreground hover:underline">
              @{tokenInitiatorUserData?.username}
            </Text>
          </Link>
        )}
        <Text className="line-clamp-1 text-sm font-medium leading-6 text-secondary">
          {description}
        </Text>
      </View>
      <View className=" flex h-20 flex-col justify-center">
        <CommunityJoinIconButton channelId={communityInfo?.channelId || ""} />
      </View>
    </View>
  );
}

export function CommunityDetailMetaInfoMobile({
  communityInfo,
  className,
  navigateBefore,
  openTradeBefore,
  ...props
}: ViewProps & {
  communityInfo: CommunityData;
  navigateBefore?: () => void;
  openTradeBefore?: () => void;
}) {
  const {
    name,
    logo,
    description,
    memberInfo,
    hostUserData,
    tokenInitiatorUserData,
    channelId,
  } = communityInfo;
  const { totalNumber, newPostNumber } = memberInfo || {};
  // const { tokenInfo, loading, rejected, loadTokenInfo } =
  //   useLoadAttentionTokenInfo({ channelId: channelId! });
  // useEffect(() => {
  //   if (rejected || loading || tokenInfo) return;
  //   loadTokenInfo();
  // }, [tokenInfo, loading, rejected, loadTokenInfo]);
  const tokenInfo = communityInfo?.attentionTokenInfo;

  const { token } = useATTNftInfo({
    tokenContract: tokenInfo?.tokenContract || "0x",
  });
  const { nftPrice } = useATTNftPrice({
    tokenContract: tokenInfo?.tokenContract || "0x",
    nftAmount: 1,
  });
  return (
    <View className={cn("w-full flex-col gap-4", className)} {...props}>
      <View className="w-full flex-row gap-3">
        <Avatar alt={name || ""} className="size-12">
          <AvatarImage source={{ uri: logo || "" }} />
          <AvatarFallback className="border-primary">
            <Text className="text-sm font-bold">{name}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 flex-col justify-center">
          <Text className="text-xl font-bold leading-6 text-primary-foreground">
            {name}
          </Text>
          <Text className="text-sm font-normal leading-6 text-primary-foreground">
            {channelId && `/${channelId}`}
          </Text>
        </View>
      </View>
      <Text className="text-sm font-normal leading-6 text-primary-foreground">
        {description}
      </Text>
      <View className="flex-row items-end gap-3">
        <View className="flex-row gap-1">
          <Text className="text-sm font-normal leading-none text-secondary">
            {displayValue(totalNumber || 0)}
          </Text>
          <Text className="text-sm font-normal leading-none text-primary-foreground">
            Followers
          </Text>
        </View>
        <View className="flex-row gap-1">
          <Text className="text-sm font-normal leading-none text-secondary">
            {displayValue(newPostNumber || 0)}
          </Text>
          <Text className="text-sm font-normal leading-none text-primary-foreground">
            New Casts
          </Text>
        </View>
      </View>
      {!!hostUserData && (
        <Link
          href={`/u/${hostUserData.fid}`}
          className="flex flex-row gap-1"
          onPress={(e) => {
            e.stopPropagation();
            if (navigateBefore) {
              navigateBefore();
            }
          }}
        >
          <Text className="text-sm font-normal leading-6 text-primary-foreground ">
            Host
          </Text>
          <Text className="text-sm font-normal leading-6 text-secondary">
            @{hostUserData?.username}
          </Text>
        </Link>
      )}
      {!!tokenInitiatorUserData && (
        <Link
          href={`/u/${tokenInitiatorUserData.fid}`}
          className="flex flex-row gap-1"
          onPress={(e) => {
            e.stopPropagation();
            if (navigateBefore) {
              navigateBefore();
            }
          }}
        >
          <Text className="text-sm font-normal leading-6 text-primary-foreground ">
            Curation Token Initiator
          </Text>
          <Text className="text-sm font-normal leading-6 text-secondary">
            @{tokenInitiatorUserData?.username}
          </Text>
        </Link>
      )}
      {(communityInfo?.attentionTokenInfo || !!tokenInfo) && (
        <Separator className="bg-secondary/20" />
      )}

      {/* {communityInfo?.attentionTokenInfo && (
        <ChannelDetailLaunchProgress
          tokenInfo={communityInfo?.attentionTokenInfo}
        />
      )} */}
      {communityInfo?.attentionTokenInfo?.poolAddress ? (
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Avatar alt={communityInfo?.name || ""} className="size-[24px]">
              <AvatarImage source={{ uri: communityInfo?.logo || "" }} />
              <AvatarFallback>
                <Text className="text-sm font-bold">{communityInfo?.name}</Text>
              </AvatarFallback>
            </Avatar>
            <Text className={cn("text-sm text-primary-foreground")}>
              {communityInfo?.name || ""}
            </Text>
          </View>
          <TradeButton
            className="h-8"
            token2={{
              chainId: ATT_CONTRACT_CHAIN.id,
              address: communityInfo?.attentionTokenInfo?.tokenContract,
            }}
            onOpenBefore={openTradeBefore}
          />
        </View>
      ) : communityInfo?.attentionTokenInfo?.progress ? (
        <View className="flex flex-row items-center justify-between">
          <Text className={cn("text-sm text-primary-foreground")}>
            Bounding Curve Progress
          </Text>
          <Text className={cn("text-sm text-primary-foreground")}>
            {communityInfo?.attentionTokenInfo?.progress}
          </Text>
        </View>
      ) : null}
      {/* {communityInfo?.attentionTokenInfo && (
        <View className="flex flex-row items-center justify-between">
          <Text className={cn("text-sm text-primary-foreground")}>
            Curation NFT
          </Text>
          <Text className={cn("text-sm text-primary-foreground")}>
            {communityInfo?.attentionTokenInfo?.readyToMintCount || 0}
          </Text>
        </View>
      )} */}

      {communityInfo?.attentionTokenInfo && (
        <View className="flex flex-row items-center justify-between">
          <Text className={cn("text-sm text-primary-foreground")}>
            Channel NFT Prices
          </Text>
          <Text className={cn("text-sm text-primary-foreground")}>
            {!!nftPrice && !!token
              ? `${formatUnits(nftPrice, token.decimals!)} ${token.symbol}`
              : "-- --"}
          </Text>
        </View>
      )}

      <Separator className="bg-secondary/20" />
      <View className="flex-row gap-4">
        <CommunityJoinButton
          channelId={communityInfo?.channelId || ""}
          variant="default"
          className="h-10 flex-1 rounded-md border-none bg-primary-foreground"
          textProps={{
            className: "text-base font-normal text-secondary",
          }}
        />
        <Link href={`/create?channelId=${channelId || ""}`} asChild>
          <Button
            className=" h-10 flex-1 rounded-md border-none bg-primary-foreground p-0"
            onPress={() => {
              if (navigateBefore) {
                navigateBefore();
              }
            }}
          >
            <Text className=" text-base font-normal text-secondary">Cast</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}

export function CommunityDetailMetaInfoDropdown({
  community,
}: {
  community: CommunityInfo;
}) {
  const { name, logo } = community;
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <View className="flex-row items-center gap-1">
          <Avatar alt={name || ""} className=" size-6">
            <AvatarImage source={{ uri: logo || "" }} />
            <AvatarFallback>
              <Text className="text-sm font-bold">{name}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className=" text-xl font-medium leading-none text-primary-foreground">
            {name}
          </Text>
          <View
            className={cn(
              " transform transition-all",
              open ? "rotate-180" : "rotate-0",
            )}
          >
            <ChevronDown className={cn(" size-5 stroke-primary-foreground ")} />
          </View>
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={15}
        className=" w-screen rounded-none border-none bg-primary p-4 pt-0"
        overlayClassName="bg-black bg-opacity-50 fixed w-screen h-[calc(100vh-100px)] top-[100px] left-0"
      >
        <CommunityDetailMetaInfoMobile
          communityInfo={community}
          navigateBefore={() => {
            setOpen(false);
          }}
          openTradeBefore={() => {
            setOpen(false);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
