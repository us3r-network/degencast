import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import { Atom } from "../common/Icons";
import { Badge } from "../ui/badge";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import PointsRulesModal from "./PointsRulesModal";
import { useState } from "react";
import { Pressable, Image, View } from "react-native";

export default function UserGlobalPoints() {
  const { totalPoints } = useUserTotalPoints();
  const { authenticated, ready, login } = usePrivy();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => {
          setOpen(true);
        }}
      >
        <Badge className="flex h-6 w-fit flex-row items-center overflow-hidden border-0 bg-[#F2B949] p-0 shadow shadow-black/25 transition-all">
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
            <Text className="text-sm text-primary">{totalPoints}</Text>
          </View>
          {ready && !authenticated && totalPoints > 0 && (
            <Button
              className="box-border h-full rounded-none bg-secondary px-2 py-0 text-xs"
              onPress={(e) => {
                e.stopPropagation();
                login();
              }}
            >
              <Text className=" text-base font-normal text-white">Claim</Text>
            </Button>
          )}
        </Badge>
        <PointsRulesModal open={open} onOpenChange={setOpen} />
      </Pressable>
    </>
  );
}
