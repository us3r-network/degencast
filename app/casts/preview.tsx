import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { Loading } from "~/components/common/Loading";
import { headerHeight } from "~/components/explore/ExploreStyled";
import FCastDetailsCard from "~/components/social-farcaster/FCastDetailsCard";
import useCastDetails from "~/hooks/social-farcaster/useCastDetails";
import useCreateCastPreview from "~/hooks/social-farcaster/useCreateCastPreview";
import { getCastRepliesCount } from "~/utils/farcaster/cast-utils";

export default function CastDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { createCastPreviewData } = useCreateCastPreview();
  const { posting, castHash } = createCastPreviewData || {};

  const {
    castDetailData,
    loading: castLoading,
    loadCastDetail,
  } = useCastDetails();
  const { cast, channel, proposal, tokenInfo } = castDetailData || {};

  useEffect(() => {
    if (castHash) {
      loadCastDetail(castHash);
    }
  }, [castHash]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          header: () => (
            <View
              style={{
                height: headerHeight,
                paddingLeft: 15,
                paddingRight: 15,
              }}
              className="flex-row items-center justify-between bg-primary"
            >
              <View className="flex flex-row items-center gap-3">
                <GoBackButtonBgPrimary
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <Text className=" text-xl font-bold text-primary-foreground">
                  Cast
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <View className=" m-auto  w-full flex-1 flex-col gap-4 p-4 py-0 sm:w-full sm:max-w-screen-sm">
        {posting || castLoading ? (
          <Loading />
        ) : !!cast ? (
          <FCastDetailsCard
            channel={channel!}
            tokenInfo={tokenInfo!}
            cast={cast!}
            proposal={proposal!}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
