import { Pressable, View, ViewProps } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import CommunityMetaInfo from "./CommunityMetaInfo";
import CastCard from "./CastCard";
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

export default function ChannelCard({
  communityInfo,
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityInfo;
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: { [key: string]: UserData };
}) {
  const dispatch = useAppDispatch();
  const { openExploreCastMenu } = useAppSelector(selectAppSettings);
  const { navigateToChannelExplore } = useChannelExplorePage();
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
    <Card
      className={cn(
        "box-border h-full w-full flex-col gap-4 rounded-[20px] border-none bg-[#F5F0FE] p-3 pt-[30px]",
        className,
      )}
      {...props}
    >
      <View className={cn("w-full flex-1 flex-col gap-4")}>
        <Link
          className="w-full"
          href={`/communities/${communityInfo.channelId}`}
          asChild
        >
          <Pressable
            className="w-full"
            onPress={(e) => {
              e.stopPropagation();
              if (!communityInfo?.channelId) return;
              navigateToCommunityDetail(communityInfo.channelId, communityInfo);
            }}
          >
            <CommunityMetaInfo communityInfo={communityInfo} />
          </Pressable>
        </Link>

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
              navigateToChannelExplore(communityInfo?.channelId || "home", {
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
        <View className=" absolute bottom-4 right-1 z-20">
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
      </View>
      {communityToken && <ExploreTradeButton token2={communityToken} />}
    </Card>
  );
}
