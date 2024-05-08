import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import { Text } from "~/components/ui/text";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import getCastHex from "~/utils/farcaster/getCastHex";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import { useCommunityCtx } from "./_layout";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import { cn } from "~/lib/utils";

export default function CastsScreen() {
  const { community } = useCommunityCtx();
  const { navigateToCastDetail } = useCastPage();
  const { navigateToChannelExplore } = useChannelExplorePage();
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const { casts, farcasterUserDataObj, loading, loadCasts } =
    useLoadCommunityCasts(id);

  return (
    <View className="flex-1">
      {casts.length > 0 && (
        <FlatList
          data={casts}
          numColumns={2}
          columnWrapperStyle={{ gap: 5 }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          renderItem={({ item, index }) => {
            const { data, platform } = item;
            const isLastItem = index === casts.length - 1;
            const isOdd = index % 2 === 0;
            return (
              <Pressable
                className={cn(
                  "flex-1",
                  isLastItem && isOdd && " w-1/2 flex-none pr-[5px]",
                )}
                onPress={() => {
                  if (community?.channelId) {
                    navigateToChannelExplore(community.channelId, {
                      origin: ChannelExploreDataOrigin.Community,
                      cast: data,
                      farcasterUserDataObj: farcasterUserDataObj,
                      community,
                    });
                  } else {
                    const castHex = getCastHex(data);
                    navigateToCastDetail(castHex, {
                      origin: CastDetailDataOrigin.Community,
                      cast: data,
                      farcasterUserDataObj: farcasterUserDataObj,
                      community,
                    });
                  }
                }}
              >
                <FcastMiniCard
                  className="flex-1"
                  cast={data}
                  farcasterUserDataObj={farcasterUserDataObj}
                />
              </Pressable>
            );
          }}
          keyExtractor={({ data, platform }, index) => index.toString()}
          onEndReached={() => {
            if (loading) return;
            loadCasts();
          }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => {
            return loading ? (
              <View className="flex items-center justify-center p-5">
                <Text>Loading ...</Text>
              </View>
            ) : null;
          }}
        />
      )}
    </View>
  );
}
