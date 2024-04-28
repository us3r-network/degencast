import { usePrivy } from "@privy-io/react-auth";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import useUserCasts from "~/hooks/user/useUserCasts";
import { ProfileFeedsGroups } from "~/services/farcaster/types";
import getCastHex from "~/utils/farcaster/getCastHex";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function CastsScreen() {
  const params = useLocalSearchParams();
  const { ready, authenticated, user, linkFarcaster } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = params.fid || farcasterAccount?.fid;
  const { casts, farcasterUserDataObj, loading, loadCasts } = useUserCasts();
  const { navigateToChannelExplore } = useChannelExplorePage();
  useEffect(() => {
    if (fid) loadCasts({ fid: String(fid), group: ProfileFeedsGroups.POSTS });
  }, [fid]);
  if (fid) {
    return (
      <View className="container h-full">
        {loading && casts.length === 0 ? (
          <Loading />
        ) : (
          <View className="flex-1">
            {casts.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={casts}
                numColumns={2}
                columnWrapperStyle={{ gap: 5 }}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                renderItem={({ item }) => {
                  const { data, platform } = item;
                  return (
                    <Pressable
                      className="flex-1"
                      onPress={() => {
                        const castHex = getCastHex(data);
                        navigateToChannelExplore(data.rootParentUrl || "", {
                          origin: ChannelExploreDataOrigin.Protfolio,
                          cast: data,
                          farcasterUserDataObj: farcasterUserDataObj,
                        });
                      }}
                    >
                      <FcastMiniCard
                        cast={data}
                        farcasterUserDataObj={farcasterUserDataObj}
                      />
                    </Pressable>
                  );
                }}
                keyExtractor={({ data, platform }) => data.id}
                onEndReached={() => {
                  if (loading) return;
                  loadCasts({
                    fid: String(fid),
                    group: ProfileFeedsGroups.POSTS,
                  });
                }}
                onEndReachedThreshold={1}
                ListFooterComponent={() => {
                  return loading ? <Loading /> : null;
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  } else {
    if (ready && authenticated && !farcasterAccount) {
      return (
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            source={require("~/assets/images/no-fid.png")}
            className="h-72 w-72"
            contentFit="fill"
            style={{ width: 280, height: 280 }}
          />
          <Text className="text-lg font-bold text-primary">
            Login with Farcaster Only
          </Text>
          <Text className="text-md text-secondary">
            Please connect Farcaster to display & create your casts
          </Text>
          <Button
            className="flex-row items-center justify-between gap-2"
            onPress={linkFarcaster}
          >
            <Image
              source={require("~/assets/images/farcaster.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text>Link Farcaster</Text>
          </Button>
        </View>
      );
    }
  }
}
