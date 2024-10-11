import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import {
  CommunityEntity,
  CommunityTokens,
} from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { Home } from "~/components/common/Icons";
import LaunchProgress from "~/components/community/LaunchProgress";

export default function ChannelMetaInfo({
  channel,
  tokenInfo,
  className,
  readOnly,
  ...props
}: ViewProps & {
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  readOnly?: boolean;
}) {
  const { navigateToCommunityDetail } = useCommunityPage();
  const { name, logo, memberInfo, channelId } = channel;
  return (
    <View className={cn("w-full ", className)} {...props}>
      <Pressable
        className={cn("w-full", readOnly && "pointer-events-none")}
        onPress={(e) => {
          e.stopPropagation();
          if (!channelId || readOnly) return;
          navigateToCommunityDetail(channelId, channel);
        }}
      >
        <View className={cn("flex w-full flex-row gap-3")}>
          <View className=" relative">
            <Avatar alt={name || ""} className="size-[48px]">
              <AvatarImage source={{ uri: logo || "" }} />
              <AvatarFallback>
                <Text className="text-sm font-bold">{name}</Text>
              </AvatarFallback>
            </Avatar>
          </View>

          <View className="flex-1 flex-col justify-between">
            <Text className="line-clamp-1 font-bold leading-6 text-foreground">
              ${channelId === "home" ? "CAST" : channelId?.toLocaleUpperCase()}
            </Text>
            <Text className="line-clamp-1 text-xs text-[#9BA1AD]">
              /{channelId}
            </Text>
          </View>
          <LaunchProgress
            tokenInfo={tokenInfo}
            textClassName="text-[#9BA1AD]"
          />
        </View>
      </Pressable>
    </View>
  );
}

export function HomeChannelMetaInfo() {
  return (
    <View className={"flex w-full flex-row items-center gap-3"}>
      <View className="flex h-[24px] w-[24px] flex-row items-center justify-center rounded-full bg-secondary/20">
        <Home className="size-[14px] stroke-primary" />
      </View>
      <Text className="line-clamp-1 font-bold leading-6 text-foreground">
        Home
      </Text>
    </View>
  );
}

export function ChannelTokenAvatar({
  tokenInfo,
  className,
}: {
  tokenInfo: {
    name: string;
    logo: string;
    contract: string;
  };
  className?: string;
}) {
  return (
    <View className={cn("flex", className)}>
      <Avatar alt={tokenInfo.name || ""} className="size-[24px]">
        <AvatarImage source={{ uri: tokenInfo.logo || "" }} />
        <AvatarFallback>
          <Text className="text-sm font-bold">{tokenInfo.name}</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  );
}

export function ChannelToken({
  tokenInfo,
  className,
}: {
  tokenInfo: AttentionTokenEntity;
  className?: string;
}) {
  return (
    <View className={cn("flex flex-row items-center gap-1", className)}>
      <ChannelTokenAvatar
        tokenInfo={{
          name: tokenInfo.name,
          logo: tokenInfo.logo,
          contract: tokenInfo.tokenContract,
        }}
      />
      <Text className={cn("font-bold text-foreground")}>{tokenInfo.name}</Text>
    </View>
  );
}

export function ChannelTokens({
  channel,
  tokenInfo,
  className,
}: {
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  className?: string;
}) {
  return (
    <View className={cn("flex flex-row items-center gap-1", className)}>
      {!!tokenInfo?.poolAddress ? (
        channel?.tokens && channel.tokens?.length > 0 ? (
          <View className="flex flex-row items-center gap-1">
            <ChannelTokenAvatar
              tokenInfo={{
                name: tokenInfo.name,
                logo: tokenInfo.logo,
                contract: tokenInfo.tokenContract,
              }}
            />
            {channel.tokens.map((token) => (
              <ChannelTokenAvatar
                key={token.contract}
                tokenInfo={{
                  name: token.tradeInfo.name,
                  logo: token.tradeInfo.imageURL,
                  contract: token.contract,
                }}
              />
            ))}
          </View>
        ) : (
          <ChannelToken tokenInfo={tokenInfo} />
        )
      ) : (
        <LaunchProgress tokenInfo={tokenInfo} />
      )}
    </View>
  );
}
