import { View, ViewProps, Pressable, PressableProps } from "react-native";
import { CommunityInfo } from "~/services/community/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import useJoinCommunityAction from "~/hooks/community/useJoinCommunityAction";
import { useRouter } from "expo-router";
import CommunityBuyShareButton from "../community/CommunityBuyShareButton";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { TradeChannelTokenButton } from "../onchain-actions/swap/TradeButton";

export default function FCastCommunity({
  communityInfo,
  className,
  ...props
}: PressableProps & {
  communityInfo: CommunityInfo;
}) {
  const router = useRouter();
  const { joined, joiningAction } = useJoinCommunityAction(communityInfo);
  const { navigateToCommunityDetail } = useCommunityPage();
  const { loading: communityTokensLoading, items: communityTokens } =
    useCommunityTokens();
  const tokenAddress = communityInfo?.tokens?.[0]?.contract;
  const communityToken = communityTokens.find(
    (item) =>
      (item.tradeInfo?.channel &&
        item.tradeInfo.channel === communityInfo?.channelId) ||
      (tokenAddress && item.tradeInfo?.tokenAddress === tokenAddress),
  );
  return (
    <Pressable
      className={cn(
        "box-border flex h-[70px] w-full flex-row items-center gap-3 rounded-[20px] bg-secondary p-3",
        className,
      )}
      onPress={() => {
        if (!communityInfo?.channelId) return;
        navigateToCommunityDetail(communityInfo.channelId, communityInfo);
      }}
      {...props}
    >
      <View className=" h-[50px] w-[50px] rounded-full bg-white">
        <Avatar
          alt={"logo"}
          className="h-full w-full rounded-full object-cover"
        >
          <AvatarImage source={{ uri: communityInfo.logo }} />
          <AvatarFallback>
            <Text>{communityInfo?.name?.slice(0, 2)}</Text>
          </AvatarFallback>
        </Avatar>
        {!joined && (
          <Pressable
            className=" absolute bottom-0 right-0"
            onPress={(e) => {
              e.stopPropagation();
              joiningAction();
            }}
          >
            <JoinIcon />
          </Pressable>
        )}
      </View>
      <Text className="line-clamp-2 flex-1 text-base text-white">
        {communityInfo.name}
      </Text>
      {communityToken && (
        <TradeChannelTokenButton
          token2={communityToken}
          className="rounded-[10px] bg-primary"
        />
      )}
      {/* {communityInfo?.shares?.[0]?.subjectAddress && (
        <CommunityBuyShareButton
          className="bg-secondary font-bold"
          communityInfo={communityInfo}
        />
      )} */}
    </Pressable>
  );
}

export function FCastCommunityDefault({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "box-border flex h-[70px] w-full flex-row items-center gap-3 rounded-[20px] bg-secondary p-3",
        className,
      )}
      {...props}
    >
      <Avatar
        alt={"logo"}
        className="flex h-[50px] w-[50px] items-center  justify-center rounded-full bg-white object-cover"
      >
        <AvatarImage
          style={{ width: 20, height: 20 }}
          source={require("~/assets/images/channel-home-icon.png")}
        />
        <AvatarFallback>
          <Text>Home</Text>
        </AvatarFallback>
      </Avatar>
      <Text className="line-clamp-2 flex-1 text-base text-white">Home</Text>
    </View>
  );
}

function JoinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <g clipPath="url(#clip0_1673_2682)">
        <rect width="25" height="25" rx="12.5" fill="white" />
        <path
          d="M12.4514 25C5.57467 25 0 19.4035 0 12.5C0 5.59645 5.57467 0 12.4514 0C19.328 0 24.9027 5.59645 24.9027 12.5C24.9027 19.4035 19.328 25 12.4514 25ZM11.4137 11.4583H6.22568C5.65262 11.4583 5.18806 11.9247 5.18806 12.5C5.18806 13.0753 5.65262 13.5417 6.22568 13.5417H11.4137V18.75C11.4137 19.3253 11.8783 19.7917 12.4514 19.7917C13.0244 19.7917 13.489 19.3253 13.489 18.75V13.5417H18.677C19.2501 13.5417 19.7147 13.0753 19.7147 12.5C19.7147 11.9247 19.2501 11.4583 18.677 11.4583H13.489V6.25C13.489 5.6747 13.0244 5.20832 12.4514 5.20832C11.8783 5.20832 11.4137 5.6747 11.4137 6.25V11.4583Z"
          fill="#F41F4C"
        />
      </g>
      <rect x="0.5" y="0.5" width="24" height="24" rx="12" stroke="white" />
      <defs>
        <clipPath id="clip0_1673_2682">
          <rect width="25" height="25" rx="12.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
