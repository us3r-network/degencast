import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { Chain, TransactionReceipt } from "viem";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ExternalLink } from "../common/ExternalLink";
import { Check, X } from "../common/Icons";
import { TransactionResultSharingButton } from "../platform-sharing/PlatformSharingButton";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";

const EXPLORE_URL = "https://www.onceupon.xyz";
export type TransationData = {
  chain: Chain;
  transactionReceipt?: TransactionReceipt;
  description: ReactNode;
};

type TransactionInfoProps = React.ComponentPropsWithoutRef<typeof View> & {
  data: TransationData;
  buttonText: string;
  buttonAction?: () => void;
};

export function TransactionInfo({
  data,
  buttonText,
  buttonAction,
}: TransactionInfoProps) {
  // console.log("TransactionSuccessInfo", data);
  return (
    <View className="flex w-full items-center gap-6">
      {data.transactionReceipt?.transactionHash ? (
        <View className="size-16 items-center justify-center rounded-full bg-[green]/40">
          <Check className="size-8 text-[green]" />
        </View>
      ) : (
        <View className="size-16 items-center justify-center rounded-full bg-[white]/40">
          {/* <Info className="size-8 text-[white]" /> */}
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <Text className="font-medium">
        {data.transactionReceipt?.transactionHash
          ? "Transaction Completed!"
          : "Confirm Transaction!"}
      </Text>
      {data.description}
      {data.transactionReceipt?.transactionHash ? (
        <View className="w-full flex-row justify-items-stretch gap-2">
          {data.chain?.blockExplorers && (
            <ExternalLink
              className="flex-1/2 text-primary-foreground/80"
              // href={`${data.chain.blockExplorers.default.url}/tx/${data.transactionReceipt.transactionHash}`}
              href={`${EXPLORE_URL}/${data.transactionReceipt.transactionHash}`}
              target="_blank"
            >
              <Button variant="outline" className="border-secondary bg-white">
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
          <TransactionResultSharingButton
            type={ONCHAIN_ACTION_TYPE.SWAP}
            transactionDetailURL={`${EXPLORE_URL}/${data.transactionReceipt.transactionHash}`}
          />
        </View>
      ) : (
        <Text className="text-sm text-secondary">Proceed in your wallet!</Text>
      )}
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
