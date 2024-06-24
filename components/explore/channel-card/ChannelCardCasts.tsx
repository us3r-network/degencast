import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import FCast from "~/components/social-farcaster/FCast";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import useCommunityPage from "~/hooks/community/useCommunityPage";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import useAppSettings from "~/hooks/useAppSettings";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";

export default function ChannelCardCasts({
  channelId,
  communityInfo,
}: {
  channelId: string;
  communityInfo: CommunityInfo;
}) {
  const { navigateToCommunityDetail } = useCommunityPage();
  const { openExploreCastMenu, setOpenExploreCastMenu } = useAppSettings();
  const { casts, loading, loadCasts } = useLoadCommunityCasts(channelId);
  const [itemWith, setItemWidth] = useState(0);
  return (
    <View
      className="h-full w-full"
      onLayout={(e) => {
        setItemWidth(e.nativeEvent.layout.width - 15);
      }}
    >
      <FlatList
        style={{
          flex: 1,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={casts}
        renderItem={({ item: cast }) => {
          return (
            <View
              style={{
                width: itemWith,
                paddingRight: 10,
              }}
            >
              <View className="relative h-full w-full">
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
                <View className=" absolute bottom-1 right-1 z-20">
                  <FCastExploreActions
                    cast={cast}
                    communityInfo={communityInfo}
                    showActions={openExploreCastMenu}
                    showActionsChange={(showActions: boolean) => {
                      setOpenExploreCastMenu(showActions);
                    }}
                  />
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          if (casts.length === 0 || loading) return;
          loadCasts();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return loading ? (
            <View className="flex items-center justify-center p-5">
              <Loading />
            </View>
          ) : null;
        }}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <View className=" mx-auto h-full max-w-72 flex-col items-center justify-center gap-8">
              <Text className=" text-center text-xl font-bold text-primary">
                Congratulations!
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
