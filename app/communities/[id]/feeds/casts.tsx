import { Link, useGlobalSearchParams } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import { useCommunityCtx } from "../_layout";
import { cn } from "~/lib/utils";
import { Loading } from "~/components/common/Loading";
import { getCastHex } from "~/utils/farcaster/cast-utils";

export default function CastsScreen() {
  const { community } = useCommunityCtx();
  const { setCastDetailCacheData } = useCastPage();

  const globalParams = useGlobalSearchParams();
  const { id } = globalParams as { id: string };
  const { casts, loading, loadCasts } = useLoadCommunityCasts(id);

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
            const isLastItem = index === casts.length - 1;
            const isOdd = index % 2 === 0;
            const castHex = getCastHex(item);
            return (
              <Link
                className={cn(
                  "flex-1",
                  isLastItem && isOdd && " w-1/2 flex-none pr-[5px]",
                )}
                href={`/casts/${castHex}`}
                onPress={(e) => {
                  e.stopPropagation();
                  setCastDetailCacheData(castHex, {
                    origin: CastDetailDataOrigin.Community,
                    cast: item,
                    community,
                  });
                }}
              >
                <FcastMiniCard className="flex-1" cast={item} />
              </Link>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (loading) return;
            loadCasts();
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
  );
}
