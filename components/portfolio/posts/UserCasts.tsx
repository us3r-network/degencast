import { usePrivy } from "@privy-io/react-auth";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useUserCasts from "~/hooks/user/useUserCasts";
import { ProfileFeedsGroups } from "~/services/farcaster/types";
import { getUserFarcasterAccount } from "~/utils/privy";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/common/Loading";

export default function CastsScreen() {
  const params = useLocalSearchParams();
  const { ready, authenticated, user, linkFarcaster } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = params.fid || farcasterAccount?.fid;
  const { casts, farcasterUserDataObj, loading, loadCasts } = useUserCasts();
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
                data={casts}
                numColumns={2}
                columnWrapperStyle={{ gap: 5 }}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                renderItem={({ item }) => {
                  const { data, platform } = item;
                  return (
                    <FcastMiniCard
                      className="flex-1"
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                    />
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
            className="flex-row items-center justify-between gap-2 rounded-lg bg-primary px-6 py-3"
            onPress={linkFarcaster}
          >
            <Image
              source={require("~/assets/images/farcaster.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text className="text-primary-foreground">Link Farcaster</Text>
          </Button>
        </View>
      );
    }
  }
}
