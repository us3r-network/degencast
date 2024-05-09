import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SHARE_CONTRACT_CHAIN } from "~/hooks/trade/useShareContract";
import { Check, X } from "../common/Icons";
import { TransactionReceipt } from "viem";
import { ReactNode } from "react";

export type TransationData = {
  transactionReceipt: TransactionReceipt;
  description: ReactNode;
};

type TransactionInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  data: TransationData;
  buttonText: string;
  buttonAction?: () => void;
};

export function TransactionSuccessInfo({
  data,
  buttonText,
  buttonAction,
}: TransactionInfoProps) {
  console.log("TransactionSuccessInfo", data);
  return (
    <View className="flex items-center gap-6">
      <View className="size-16 items-center justify-center rounded-full bg-[green]/40">
        <Check className="size-8 text-[green]" />
      </View>
      <Text className="font-interBold">Transaction Completed!</Text>
      {data.description}
      <View className="w-full flex-row justify-items-stretch gap-4">
        <Link
          className="flex-1/2 text-primary-foreground/80"
          href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${data.transactionReceipt.transactionHash}`}
          target="_blank"
        >
          <Button variant="outline" className="w-full border-secondary">
            <Text className="text-secondary">See Details</Text>
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="flex-1"
          onPress={() => {
            buttonAction?.();
          }}
        >
          <Text>{buttonText}</Text>
        </Button>
      </View>
    </View>
  );
}

type ErrorInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  error: string;
  buttonText: string;
  buttonAction?: () => void;
};
export function ErrorInfo({ error, buttonText, buttonAction }: ErrorInfoProps) {
  return (
    <View className="flex items-center gap-6">
      <View className="size-16 items-center justify-center rounded-full bg-[red]/40">
        <X className="size-8 text-[red]" />
      </View>
      <Text className="font-interBold">{error}</Text>
      <View className="w-full flex-row justify-items-stretch gap-4">
        <Button
          variant="secondary"
          className="flex-1"
          onPress={() => {
            buttonAction?.();
          }}
        >
          <Text>{buttonText}</Text>
        </Button>
      </View>
    </View>
  );
}
