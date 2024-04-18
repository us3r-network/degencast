import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import CardSwipe from "~/components/common/CardSwipe";
import FCast from "~/components/social-farcaster/FCast";
import FCastActions from "~/components/social-farcaster/FCastActions";

import { Card } from "~/components/ui/card";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import useLoadExploreCasts, {
  MAX_VISIBLE_ITEMS,
} from "~/hooks/explore/useLoadExploreCasts";
import { cn } from "~/lib/utils";
import getCastHex from "~/utils/farcaster/getCastHex";
import { useNavigation } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";

export default function ExploreScreen() {
  const { casts, currentCastIndex, removeCast, farcasterUserDataObj } =
    useLoadExploreCasts();
  const animatedValue = useSharedValue(0);
  const router = useRouter();
  // const navigation = useNavigation();
  const { navigateToCastDetail } = useCastPage();
  return (
    <View className={cn("flex-1 overflow-y-hidden bg-background pb-11 pt-16")}>
      <View className={cn("h-full w-full sm:mx-auto sm:my-0 sm:w-[430px]")}>
        <GestureHandlerRootView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {casts.map(({ data, platform, community }, idx) => {
            if (
              idx > currentCastIndex + MAX_VISIBLE_ITEMS - 1 ||
              idx < currentCastIndex
            ) {
              return null;
            }
            let backgroundColor = "#FFFFFF";
            // if (currentCastIndex + 1 === idx) {
            //   backgroundColor = "rgba(255, 255, 255, 0.80)";
            // }
            if (currentCastIndex + 2 === idx) {
              backgroundColor = "rgba(255, 255, 255, 0.60)";
            }
            return (
              <CardSwipe
                key={data.id}
                animatedValue={animatedValue}
                maxVisibleItems={MAX_VISIBLE_ITEMS}
                index={idx}
                currentIndex={currentCastIndex}
                backgroundColor={backgroundColor}
                onNext={() => {
                  removeCast(idx);
                }}
              >
                <Card
                  className={cn(
                    "h-[calc(100vh-64px-98px-66px-34px)] w-[calc(100vw-40px)] rounded-2xl border-none sm:max-h-[690px] sm:w-[390px]",
                    "bg-transparent",
                  )}
                >
                  <Pressable
                    className={cn("h-full w-full overflow-hidden p-5")}
                    onPress={() => {
                      const castHex = getCastHex(data);
                      // router.push(`/casts/${castHex}`);
                      navigateToCastDetail(castHex, {
                        origin: CastDetailDataOrigin.Explore,
                        cast: data,
                        farcasterUserDataObj: farcasterUserDataObj,
                        community,
                      });
                    }}
                  >
                    <FCast
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                    />
                  </Pressable>
                  <FCastActions
                    className=" absolute bottom-14 right-3"
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
                  {community ? (
                    <FCastCommunity
                      communityInfo={community}
                      className="absolute -bottom-11 right-1/2 translate-x-1/2"
                    />
                  ) : (
                    <FCastCommunityDefault className="absolute -bottom-11 right-1/2 translate-x-1/2" />
                  )}
                </Card>
              </CardSwipe>
            );
          })}
        </GestureHandlerRootView>
      </View>
    </View>
  );
}
