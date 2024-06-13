import { useEffect } from "react";
import { View } from "react-native";
import useLoadCoverChannels from "~/hooks/community/useLoadCoverChannels";
import CoverChannels from "./CoverChannels";
import { Loading } from "../common/Loading";

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
        <CoverChannels data={coverChannels} />
      )}
    </View>
  );
}
