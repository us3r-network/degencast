import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import CardSwipe from "~/components/common/CardSwipe";
import FCast from "~/components/social-farcaster/FCast";
import FCastActions from "~/components/social-farcaster/FCastActions";
import useLoadExploreCasts from "~/hooks/explore/useLoadExploreCasts";
import { cn } from "~/lib/utils";

const MAX_VISIBLE_ITEMS = 3;
export default function ExploreScreen() {
  const { casts, currentCastIndex, removeCast, farcasterUserDataObj } =
    useLoadExploreCasts();
  const animatedValue = useSharedValue(0);
  return (
    <View className={cn("flex-1 bg-primary")}>
      <View className={cn("h-full w-full sm:mx-auto sm:my-0 sm:w-[430px]")}>
        <GestureHandlerRootView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {casts.map(({ data, platform }, idx) => {
            if (
              idx > currentCastIndex + MAX_VISIBLE_ITEMS - 1 ||
              idx < currentCastIndex
            ) {
              return null;
            }
            let backgroundColor = "#FFFFFF";
            if (currentCastIndex + 1 === idx) {
              backgroundColor = "rgba(255, 255, 255, 0.80)";
            }
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
                <View
                  className={cn(
                    "h-[calc(100vh-240px)] w-[calc(100vw-40px)] overflow-hidden rounded-2xl border-none p-5 sm:max-h-[690px] sm:w-[390px]",
                  )}
                >
                  <FCast
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                  />
                  <FCastActions
                    className=" absolute bottom-14 right-3"
                    cast={data}
                  />
                </View>
              </CardSwipe>
            );
          })}
        </GestureHandlerRootView>
      </View>
    </View>
  );
}
