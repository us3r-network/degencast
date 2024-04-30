import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useUserDegenAllowanceAction from "~/hooks/user/useUserDegenAllowanceAction";
import { Image } from "react-native";

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
  const [allowanceValue, setAllowanceValue] = useState("");
  const { loading, degenAllowanceAction } = useUserDegenAllowanceAction({
    cast,
    onSuccess: () => {
      onOpenChange(false);
    },
  });
  const tipsCount = [
    { label: "5%", value: remainingAllowance * 0.05 },
    { label: "25%", value: remainingAllowance * 0.25 },
    { label: "50%", value: remainingAllowance * 0.5 },
    { label: "100%", value: remainingAllowance },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <DialogHeader>
          <Text>Tips with allowance</Text>
        </DialogHeader>
        <View className="max-w-s flex flex-col gap-5 ">
          <View className=" flex flex-row items-center justify-between gap-5">
            <Text className=" text-xs text-white">Get 5 points when tips</Text>
            <View className="flex flex-row items-center gap-2">
              <Image
                source={require("~/assets/images/degen-icon-2.png")}
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
              <Text className=" text-base font-medium">DEGEN</Text>
            </View>
          </View>
          <View className="flex flex-row items-center justify-between gap-1">
            {tipsCount.map(({ label, value }) => {
              const isAllowance =
                Number(remainingAllowance) !== 0 &&
                Number(remainingAllowance) >= Number(value);
              return (
                <Button
                  key={label}
                  disabled={!isAllowance || loading}
                  className={cn(
                    "min-w-[80px] rounded-full border bg-white p-2  hover:cursor-pointer",
                  )}
                  onPress={() => {
                    setAllowanceValue(`${value}`);
                  }}
                >
                  <Text
                    className={cn(
                      "text-sm text-black",
                      isAllowance &&
                        allowanceValue === `${value}` &&
                        " text-primary",
                    )}
                  >
                    {label}
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
          </View>
          <Button
            className="font-bold text-white"
            variant={"secondary"}
            disabled={loading}
            onPress={() => {
              // TODO toast
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
            <Text>Tip</Text>
          </Button>
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
