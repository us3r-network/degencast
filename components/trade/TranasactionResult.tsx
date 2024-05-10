import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SHARE_CONTRACT_CHAIN } from "~/hooks/trade/useShareContract";
import { Check, X } from "../common/Icons";
import { Chain, TransactionReceipt } from "viem";
import { ReactNode } from "react";
import { base } from "viem/chains";
import { ExternalLink } from "../common/ExternalLink";

export type TransationData = {
  chain: Chain;
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
    <View className="flex w-full items-center gap-6">
      <View className="size-16 items-center justify-center rounded-full bg-[green]/40">
        <Check className="size-8 text-[green]" />
      </View>
      <Text className="font-medium">Transaction Completed!</Text>
      {data.description}
      <View className="w-full flex-row justify-items-stretch gap-4">
        {data.chain?.blockExplorers && (
          <ExternalLink
            className="flex-1/2 text-primary-foreground/80"
            href={`${data.chain.blockExplorers.default.url}/tx/${data.transactionReceipt.transactionHash}`}
            target="_blank"
          >
            <Button variant="outline" className="bg-white border-secondary">
              <Text className="text-secondary">See Details</Text>
            </Button>
          </ExternalLink>
        )}
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
      <Text className="font-medium">{error}</Text>
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
