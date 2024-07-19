import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityAvatarJoinIconButton } from "~/components/community/CommunityJoinButton";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { Progress } from "~/components/ui/progress";
import { Home } from "~/components/common/Icons";

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
  ...props
}: ViewProps & {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
}) {
  const { navigateToCommunityDetail } = useCommunityPage();
  const { name, logo, memberInfo, channelId } = channel;
  const { totalNumber, newPostNumber } = memberInfo || {};
  const progressNumber = Number(tokenInfo.progress.replace("%", ""));

  return (
    <View className={cn("w-full flex-col gap-4", className)} {...props}>
      <Pressable
        className="w-full flex-col gap-4"
        onPress={(e) => {
          e.stopPropagation();
          if (!channelId) return;
          navigateToCommunityDetail(channelId, channel);
        }}
      >
        <View className={cn("flex w-full flex-row gap-3")}>
          <View className=" relative">
            <Avatar
              alt={name || ""}
              className="size-[50px] border border-secondary"
            >
              <AvatarImage source={{ uri: logo || "" }} />
              <AvatarFallback className="border-primary bg-secondary">
                <Text className="text-sm font-bold">{name}</Text>
              </AvatarFallback>
            </Avatar>
            {channelId && (
              <CommunityAvatarJoinIconButton
                channelId={channelId}
                className=" absolute -bottom-1 -right-1"
              />
            )}
          </View>

          <View className="flex-1 flex-col justify-center">
            <Text className="line-clamp-1 font-bold leading-6">{name}</Text>
            <Text className="text-sm font-normal leading-6 text-[#9BA1AD]">
              {channelId && `/${channelId}`}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-1">
            <Progress
              value={progressNumber}
              className="h-4 w-[100px] bg-[#D6A5EC]"
              indicatorClassName=" rounded-4 bg-[#9151C3]"
            />
            <Text className="text-xl">{progressNumber}%</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export function HomeChannelMetaInfo() {
  return (
    <View className={"flex w-full flex-row items-center gap-3"}>
      <View className="flex h-[50px] w-[50px] flex-row items-center justify-center rounded-full bg-secondary/20">
        <Home className="size-[24px] stroke-primary" />
      </View>
      <Text className="line-clamp-1 font-bold leading-6">Home</Text>
    </View>
  );
}
