import { FlatList, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import ChannelCard from "~/components/explore/channel-card/ChannelCard";
import { Text } from "~/components/ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserCasts from "~/hooks/user/useUserCasts";
import useUserCurationCasts from "~/hooks/user/useUserCurationCasts";

export function UserCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, loadItems } = useUserCasts(fid, currFid);
  return (
    <CastList
      items={items.map((item) => ({
        channel: item.channel,
        casts: item?.cast ? [{ cast: item.cast, proposal: item.proposal }] : [],
        tokenInfo: item.tokenInfo,
      }))}
      loading={loading}
      load={loadItems}
    />
  );
}

export function UserCurationCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, loadItems } = useUserCurationCasts(fid, currFid);
  return (
    <CastList
      items={items.map((item) => ({
        channel: item.channel,
        casts: item?.cast ? [{ cast: item.cast, proposal: item.proposal }] : [],
        tokenInfo: item.tokenInfo,
      }))}
      loading={loading}
      load={loadItems}
    />
  );
}

function CastList({
  items,
  loading,
  load,
}: {
  items: any[];
  loading: boolean;
  load: () => void;
}) {
  return (
    <View className="container h-full">
      {loading && items.length === 0 ? (
        <Loading />
      ) : (
        <View className="flex-1">
          <FlatList
            style={{
              flex: 1,
            }}
            showsHorizontalScrollIndicator={false}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => {
              if (loading || (!loading && items?.length === 0)) return;
              load();
              return;
            }}
            onEndReachedThreshold={1}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item, index }) => {
              const { channel, casts, tokenInfo } = item;
              return (
                <ChannelCard
                  key={index.toString()}
                  channel={channel}
                  tokenInfo={tokenInfo}
                  casts={casts}
                />
              );
            }}
            ListFooterComponent={() => {
              if (loading) {
                return (
                  <>
                    <View className="ios:pb-0 items-center py-3">
                      <Text
                        nativeID="invoice-table"
                        className="items-center text-sm text-muted-foreground"
                      >
                        <Loading />
                      </Text>
                    </View>
                  </>
                );
              }
            }}
          />
        </View>
      )}
    </View>
  );
}
