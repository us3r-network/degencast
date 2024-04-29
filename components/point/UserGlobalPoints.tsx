import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import { Atom } from "../common/Icons";
import { Badge } from "../ui/badge";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import PointsRulesModal from "./PointsRulesModal";
import { useState } from "react";
import { Pressable } from "react-native";

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
        <Badge className="flex h-6 w-fit flex-row items-center gap-1 bg-[#F41F4C] px-2 py-0">
          <Atom color="#FFFFFF" className="h-4 w-4" />
          <Text className=" text-base text-white">{totalPoints}</Text>
          {ready && !authenticated && totalPoints > 0 && (
            <Button
              className=" ml-1 box-border h-4 rounded-full bg-secondary px-1 py-0 text-xs text-white"
              onPress={(e) => {
                e.stopPropagation();
                login();
              }}
            >
              <Text className="text-xs text-white">Claim</Text>
            </Button>
          )}
        </Badge>
        <PointsRulesModal open={open} onOpenChange={setOpen} />
      </Pressable>
    </>
  );
}
