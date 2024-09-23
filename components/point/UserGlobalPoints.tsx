import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import { Badge } from "../ui/badge";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import PointsRulesModal from "./PointsRulesModal";
import { useEffect, useRef, useState } from "react";
import { Pressable, Image, View, Animated } from "react-native";
import useAuth from "~/hooks/user/useAuth";
import { Link } from "expo-router";

export default function UserGlobalPoints() {
  const { totalPoints } = useUserTotalPoints();
  const { login, ready, authenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const pointChangeAnimation = useState(new Animated.Value(0))[0];
  const totalPointsPrev = useRef(totalPoints);
  useEffect(() => {
    if (totalPoints === totalPointsPrev.current) return;
    totalPointsPrev.current = totalPoints;
    Animated.timing(pointChangeAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      pointChangeAnimation.setValue(0);
    });
  }, [totalPoints]);

  const pointAnimationStyle = {
    transform: [
      {
        scale: pointChangeAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };
  const pointAnimationTextStyle = {
    opacity: pointChangeAnimation.interpolate({
      inputRange: [0, 0.01, 1],
      outputRange: [1, 0, 1],
    }),
  };
  return (
    <>
      <Link asChild href="/point">
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            // setOpen(true);
          }}
        >
          <Animated.View style={[pointAnimationStyle]}>
            <Badge className="flex h-6 w-fit flex-row items-center overflow-hidden border-0 bg-[#F2B949] p-0 transition-all">
              {/* <Atom className="size-4 text-white" /> */}
              <View className="flex h-full flex-row items-center gap-1 px-2 py-0">
                <Image
                  source={require("~/assets/images/wand-sparkles.png")}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: "contain",
                  }}
                />
                <Animated.View style={[pointAnimationTextStyle]}>
                  <Text className="text-sm text-primary">{totalPoints}</Text>
                </Animated.View>
              </View>
              {ready && !authenticated && totalPoints > 0 && (
                <View className="h-full pr-2">
                  <Button
                    className="my-auto box-border h-[18px] rounded-full bg-secondary"
                    onPress={(e) => {
                      e.stopPropagation();
                      login();
                    }}
                  >
                    <Text className=" text-xs font-normal text-white">
                      Claim
                    </Text>
                  </Button>
                </View>
              )}
            </Badge>
          </Animated.View>
          <PointsRulesModal open={open} onOpenChange={setOpen} />
        </Pressable>
      </Link>
    </>
  );
}
