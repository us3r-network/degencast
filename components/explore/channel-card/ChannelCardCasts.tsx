import { useRef, useState } from "react";
import { FlatList, LayoutRectangle, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import FCast from "~/components/social-farcaster/FCast";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import { getCastHex } from "~/utils/farcaster/cast-utils";
export default function ChannelCardCasts({
  channelId,
  communityInfo,
}: {
  channelId: string;
  communityInfo: CommunityInfo;
}) {
  const { navigateToCommunityDetail } = useCommunityPage();

  const { casts, loading, pageInfo } = useLoadCommunityCasts(channelId);
  const [layout, setLayout] = useState<LayoutRectangle>();
  const layoutRef = useRef<LayoutRectangle>();
  const layoutWidth = layout?.width || 0;
  const layoutHeight = layout?.height || 0;
  const itemWidth = layoutWidth ? layoutWidth - 30 : 0;
  const itemHeight = layoutHeight;

  return (
    <View
      className="h-full w-full"
      onLayout={(e) => {
        if (!layoutRef.current) {
          setLayout(e.nativeEvent.layout);
          layoutRef.current = e.nativeEvent.layout;
        }
      }}
    >
      <FlatList
        data={casts}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
        style={{ flex: 1 }}
        renderItem={({ item: cast, index }) => {
          return (
            <View
              key={getCastHex(cast)}
              className="h-full"
              style={{
                height: itemHeight,
                width: itemWidth,
              }}
            >
              <View
                className="relative h-full w-full"
                style={{
                  marginLeft: 15,
                }}
              >
                <Card
                  className={cn(
                    "z-10 box-border h-full w-full overflow-hidden rounded-[20px] border-none p-4 pb-0",
                  )}
                >
                  <Pressable
                    className={cn(" w-full ")}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigateToCommunityDetail(
                        channelId,
                        communityInfo,
                        "casts",
                      );
                    }}
                  >
                    <FCast cast={cast} webpageImgIsFixedRatio={true} />
                  </Pressable>
                </Card>
                <View className=" absolute bottom-4 right-4 z-20">
                  <FCastExploreActions
                    cast={cast}
                    communityInfo={communityInfo}
                  />
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          return;
          // if (casts.length === 0 || loading) return;
          // loadCasts();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return loading ? (
            <View
              className="flex items-center justify-center p-5"
              style={{
                height: itemHeight,
                width: layoutWidth + 5,
              }}
            >
              <Loading />
            </View>
          ) : pageInfo?.hasNextPage ? (
            <View
              style={{
                height: itemHeight,
                width: layoutWidth + 5,
              }}
            >
              <View
                className="relative h-full w-full"
                style={{
                  width: itemWidth,
                  marginLeft: 20,
                }}
              >
                <Pressable
                  className={cn(" h-full w-full")}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigateToCommunityDetail(
                      channelId,
                      communityInfo,
                      "casts",
                    );
                  }}
                >
                  <Card
                    className={cn(
                      "z-10 box-border flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] border-none p-4 pb-0",
                    )}
                  >
                    <Text className=" text-center text-xl font-bold text-secondary">
                      View More
                    </Text>
                  </Card>
                </Pressable>
              </View>
            </View>
          ) : null;
        }}
        ListEmptyComponent={() => {
          return null;
        }}
      />
    </View>
  );
}
