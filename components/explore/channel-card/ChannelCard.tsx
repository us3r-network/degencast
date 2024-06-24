import { Pressable, View, ViewProps } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import CommunityMetaInfo from "./CommunityMetaInfo";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { ExploreTradeButton } from "~/components/trade/TradeButton";
import { Link } from "expo-router";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectAppSettings,
  setOpenExploreCastMenu,
} from "~/features/appSettingsSlice";
import FCast from "~/components/social-farcaster/FCast";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import { ExploreApplyLaunchButton } from "~/components/common/ApplyLaunchButton";
import { ExploreCard } from "../ExploreStyled";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { Button } from "~/components/ui/button";
import ChannelCardCasts from "./ChannelCardCasts";

export default function ChannelCard({
  communityInfo,
  cast,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityInfo;
  cast?: FarCast | NeynarCast | null;
}) {
  const { channelId } = communityInfo;
  const dispatch = useAppDispatch();
  const { openExploreCastMenu } = useAppSelector(selectAppSettings);
  const { navigateToCommunityDetail } = useCommunityPage();
  const { loading: communityTokensLoading, items: communityTokens } =
    useCommunityTokens();
  const tokenAddress = communityInfo?.tokens?.[0]?.contract;
  const communityToken = communityTokens.find(
    (item) =>
      (item.tradeInfo?.channel && item.tradeInfo.channel === channelId) ||
      (tokenAddress && item.tradeInfo?.tokenAddress === tokenAddress),
  );

  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost =
    !!channelId && !!channels.find((channel) => channel.id === channelId);

  return (
    <ExploreCard className={cn("bg-[#F5F0FE]", className)} {...props}>
      <View className={cn("w-full flex-1 flex-col gap-4")}>
        <CommunityMetaInfo communityInfo={communityInfo} />
        {channelId && (
          <View className="w-full flex-1">
            <ChannelCardCasts
              channelId={channelId}
              communityInfo={communityInfo}
            />
          </View>
        )}

        {/* {cast && (
          <>
            <Card
              className={cn(
                "z-10 box-border w-full flex-1 overflow-hidden rounded-[20px] border-none p-4 pb-0",
              )}
            >
              <Pressable
                className={cn(" w-full ")}
                onPress={(e) => {
                  e.stopPropagation();
                  navigateToCommunityDetail(
                    communityInfo?.channelId || "",
                    communityInfo,
                    "casts",
                  );
                }}
              >
                <FCast cast={cast} webpageImgIsFixedRatio={true} />
              </Pressable>
            </Card>
            <View className=" absolute bottom-1 right-1 z-20">
              <FCastExploreActions
                cast={cast}
                communityInfo={communityInfo}
                showActions={openExploreCastMenu}
                showActionsChange={(showActions: boolean) => {
                  dispatch(setOpenExploreCastMenu(showActions));
                }}
              />
            </View>
          </>
        )} */}
      </View>
      <View className="w-full flex-row justify-between gap-4">
        <CommunityJoinButton
          variant="secondary"
          className=" h-10 flex-1 rounded-md bg-white"
          textProps={{
            className: "text-base font-normal text-secondary",
          }}
          channelId={channelId || ""}
        />
        <Link
          href={`/create${channelId ? "?channelId=" + channelId : ""}`}
          asChild
        >
          <Button className=" h-10 flex-1 rounded-md bg-white p-0">
            <Text className=" text-base font-normal text-secondary">Cast</Text>
          </Button>
        </Link>
      </View>
      {communityToken && <ExploreTradeButton token2={communityToken} />}
      {channelId && !communityToken && isChannelHost && (
        <ExploreApplyLaunchButton channelId={channelId} />
      )}
    </ExploreCard>
  );
}
