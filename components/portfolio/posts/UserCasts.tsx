import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserCasts from "~/hooks/user/useUserCasts";
import { cn } from "~/lib/utils";
import { getCastHex } from "~/utils/farcaster/cast-utils";

export function CastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const {
    items: casts,
    loading,
    loadMore,
  } = useUserCasts(fid, currFid);
  const { navigateToCastDetail } = useCastPage();
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
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              renderItem={({ item, index }) => {
                const isLastItem = index === casts.length - 1;
                const isOdd = index % 2 === 0;
                return (
                  <Pressable
                    className={cn(
                      "flex-1",
                      isLastItem && isOdd && " w-1/2 flex-none pr-[5px]",
                    )}
                    onPress={() => {
                      const castHex = getCastHex(item);
                      navigateToCastDetail(castHex, {
                        origin: CastDetailDataOrigin.Protfolio,
                        cast: item,
                      });
                    }}
                  >
                    <FcastMiniCard className="flex-1" cast={item} />
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.hash}
              onEndReached={() => {
                if (loading) return;
                loadMore();
              }}
              onEndReachedThreshold={1}
              ListFooterComponent={() => {
                return loading ? (
                  <View className="flex items-center justify-center p-5">
                    <Loading />
                  </View>
                ) : null;
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
