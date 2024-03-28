import { GestureHandlerRootView } from "react-native-gesture-handler";
import FCast from "~/components/social-farcaster/FCast";
import { Card } from "~/components/ui/card";
import useLoadExploreCasts from "~/hooks/explore/useLoadExploreCasts";

export default function ExploreScreen() {
  const { showCasts, removeCast, farcasterUserDataObj } = useLoadExploreCasts();

  return (
    <GestureHandlerRootView style={{ flex: 1, overflow: "scroll" }}>
      {showCasts.map(({ data, platform }, idx) => (
        <Card
          key={data.id}
          className="
            w-[calc(100vw-40px)] max-w-[390px]
            rounded-2xl border-none p-5 
          "
        >
          <FCast cast={data} farcasterUserDataObj={farcasterUserDataObj} />
        </Card>
      ))}
    </GestureHandlerRootView>
  );
}
