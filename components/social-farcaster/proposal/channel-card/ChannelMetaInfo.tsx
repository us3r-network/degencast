import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityAvatarJoinIconButton } from "~/components/community/CommunityJoinButton";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { Home } from "~/components/common/Icons";
import LaunchProgress from "~/components/community/LaunchProgress";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import { CreateTokenButton } from "~/components/trade/ATTButton";
import { useState } from "react";

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(Number(value));
};
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
  const { totalNumber, newPostNumber } = memberInfo || {};
  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost =
    !!channelId && !!channels.find((channel) => channel.id === channelId);

  const [tokenLaunched, setTokenLaunched] = useState(false);
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
            <Avatar alt={name || ""} className="size-[24px]">
              <AvatarImage source={{ uri: logo || "" }} />
              <AvatarFallback>
                <Text className="text-sm font-bold">{name}</Text>
              </AvatarFallback>
            </Avatar>
            {/* {channelId && !readOnly && (
              <CommunityAvatarJoinIconButton
                channelId={channelId}
                className=" absolute -bottom-1 -right-1"
              />
            )} */}
          </View>

          <View className="flex-1 flex-col justify-center">
            <Text className="line-clamp-1 font-bold leading-6 text-foreground">
              {name}
            </Text>
            {/* <Text className="text-sm font-normal leading-6 text-[#9BA1AD]">
              {channelId && `/${channelId}`}
            </Text> */}
          </View>
          {tokenInfo ? (
            <LaunchProgress tokenInfo={tokenInfo} />
          ) : isChannelHost && !tokenLaunched ? (
            <CreateTokenButton
              channelId={channelId!}
              onComplete={() => {
                setTokenLaunched(true);
              }}
              className="h-8"
              renderBottonContent={({ loading }) => {
                return loading ? (
                  <Text className="text-lg font-bold">Launching Token...</Text>
                ) : (
                  <Text className="text-lg font-bold">Launch Token</Text>
                );
              }}
            />
          ) : null}
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
