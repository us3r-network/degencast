import { Pressable, View, ViewProps } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import CommunityMetaInfo from "./CommunityMetaInfo";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { UserData } from "~/utils/farcaster/user-data";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { ExploreTradeButton } from "~/components/trade/TradeButton";
import { Link } from "expo-router";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectAppSettings,
  setOpenExploreCastMenu,
} from "~/features/appSettingsSlice";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import FCast from "~/components/social-farcaster/FCast";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import ApplyLaunchButton, {
  ExploreApplyLaunchButton,
} from "~/components/common/ApplyLaunchButton";
import { ExploreCard } from "../ExploreStyled";

export default function ChannelCard({
  communityInfo,
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityInfo;
  cast?: FarCast | NeynarCast | null;
  farcasterUserDataObj?: { [key: string]: UserData };
}) {
  const { channelId } = communityInfo;
  const dispatch = useAppDispatch();
  const { openExploreCastMenu } = useAppSelector(selectAppSettings);
  const { navigateToChannelExplore } = useChannelExplorePage();
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

        {cast && (
          <>
            <Text className=" text-base font-bold">Hot Cast</Text>
            <Card
              className={cn(
                "z-10 box-border w-full flex-1 overflow-hidden rounded-[20px] border-none p-4 pb-0",
              )}
            >
              <Pressable
                className={cn(" w-full ")}
                onPress={(e) => {
                  e.stopPropagation();
                  navigateToChannelExplore(channelId || "home", {
                    origin: ChannelExploreDataOrigin.Explore,
                    cast: cast,
                    farcasterUserDataObj: farcasterUserDataObj,
                    community: communityInfo,
                  });
                }}
              >
                <FCast
                  cast={cast}
                  farcasterUserDataObj={farcasterUserDataObj}
                  webpageImgIsFixedRatio={true}
                />
              </Pressable>
            </Card>
            <View className=" absolute bottom-1 right-1 z-20">
              <FCastExploreActions
                cast={cast}
                farcasterUserDataObj={farcasterUserDataObj}
                communityInfo={communityInfo}
                showActions={openExploreCastMenu}
                showActionsChange={(showActions: boolean) => {
                  dispatch(setOpenExploreCastMenu(showActions));
                }}
              />
            </View>
          </>
        )}
      </View>
      {communityToken && <ExploreTradeButton token2={communityToken} />}
      {channelId && !communityToken && isChannelHost && (
        <ExploreApplyLaunchButton channelId={channelId} />
      )}
    </ExploreCard>
  );
}
