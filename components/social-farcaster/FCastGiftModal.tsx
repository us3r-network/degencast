import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useUserDegenAllowanceAction from "~/hooks/user/useUserDegenAllowanceAction";

export default function FCastGiftModal({
  totalAllowance,
  remainingAllowance,
  cast,
  open,
  onOpenChange,
}: {
  totalAllowance: number;
  remainingAllowance: number;
  cast: FarCast;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tipsCount = [69, 420, 42069, 69420];
  const [allowanceValue, setAllowanceValue] = useState("");
  const { loading, degenAllowanceAction } = useUserDegenAllowanceAction({
    cast,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <View className="max-w-s flex flex-col gap-5 ">
          <View className=" flex flex-row items-center justify-between gap-5">
            <Text className=" text-xs text-white">
              Get equal points when tips
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between gap-1">
            {tipsCount.map((item) => {
              const isAllowance = remainingAllowance >= item;
              return (
                <Button
                  key={item}
                  disabled={!isAllowance || loading}
                  className={cn(
                    "min-w-[80px] rounded-full border bg-white p-2  hover:cursor-pointer",
                  )}
                  onPress={() => {
                    setAllowanceValue(`${item}`);
                  }}
                >
                  <Text
                    className={cn(
                      "text-sm text-black",
                      allowanceValue === `${item}` && "text-[#F41F4C]",
                    )}
                  >
                    ${item}
                  </Text>
                </Button>
              );
            })}
          </View>
          <View className="flex flex-row items-center gap-5">
            <Text className="text-base font-medium text-white">or</Text>
            <View className="box-border flex h-10 flex-1 flex-grow flex-row items-center gap-3 rounded-full bg-[#a36efe1a] px-4 py-3 text-xs color-white">
              <Input
                className={cn(
                  "h-full flex-1 bg-transparent color-white placeholder:text-xs placeholder:color-white",
                  "rounded-full border-0 outline-none",
                  "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
                )}
                aria-disabled={loading}
                placeholder={`Max ${remainingAllowance}`}
                value={allowanceValue}
                autoFocus={true}
                onChangeText={(text) => {
                  setAllowanceValue(text);
                }}
              />
              <Text className=" text-base font-medium text-white">DEGEN</Text>
            </View>
            <Button
              className="rounded-full bg-[#F41F4C] font-bold text-white hover:cursor-pointer"
              disabled={loading}
              onPress={() => {
                console.log(allowanceValue);
                if (!Number(allowanceValue)) {
                  console.error("no allowance value");
                  return;
                }
                if (
                  Number.isNaN(Number(allowanceValue)) ||
                  Number.isNaN(Number(totalAllowance)) ||
                  Number(allowanceValue) > Number(totalAllowance)
                ) {
                  console.error("not enough allowance");
                  return;
                }
                degenAllowanceAction(Number(allowanceValue));
              }}
            >
              <Text>Tip by Reply</Text>
            </Button>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className=" text-base font-medium text-white">
              Daily Allowance:
            </Text>
            <Text className=" text-base font-medium text-white">
              {remainingAllowance} / {totalAllowance} DEGEN
            </Text>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
}
