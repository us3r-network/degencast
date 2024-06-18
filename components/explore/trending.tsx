import { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import useLoadCoverChannels from "~/hooks/community/useLoadCoverChannels";
import CoverChannels from "./CoverChannels";
import { Loading } from "../common/Loading";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { cn } from "~/lib/utils";
import TrendingChannels from "./TrendingChannels";
import { itemHeight, itemPaddingTop } from "./ExploreStyled";

export default function TrendingScreen() {
  const {
    coverChannels,
    loadCoverChannels,
    loading: coverChannelsLoading,
  } = useLoadCoverChannels();
  useEffect(() => {
    if (!coverChannelsLoading && coverChannels.length === 0) {
      loadCoverChannels();
    }
  }, [coverChannelsLoading, coverChannels, loadCoverChannels]);
  return (
    <View className="h-full w-full">
      {coverChannelsLoading ? (
        <View className="flex-1">
          <Loading />
        </View>
      ) : (
        <ScrollView
          style={{ height: itemHeight }}
          className="w-full"
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          scrollsToTop={false}
        >
          <View
            className={cn("w-full")}
            style={{
              height: itemHeight,
              paddingTop: itemPaddingTop,
            }}
          >
            <CoverChannels data={coverChannels} />
          </View>
          <View
            className={cn("w-full")}
            style={{
              height: itemHeight,
            }}
          >
            <TrendingChannels />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
