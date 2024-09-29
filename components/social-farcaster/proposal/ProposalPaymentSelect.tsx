import { Pressable, View } from "react-native";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { Text } from "~/components/ui/text";
import {
  DEFAULT_CHAIN,
  DEGEN_TOKEN_ADDRESS,
  DEGEN_TOKEN_METADATA,
} from "~/constants";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";

export enum PaymentType {
  NativeToken = "nativeToken",
  Erc20 = "erc20",
  Allowance = "allowance",
}
export type PaymentOption = {
  value: PaymentType;
  label: string;
  token?: TokenWithTradeInfo;
};
export default function ProposalPaymentSelect({
  chain = DEFAULT_CHAIN,
  value: selectedValue,
  hideNativeToken,
  hideAllowance,
  onValueChange,
  onOptionChange,
}: {
  chain?: Chain;
  value: PaymentType;
  hideNativeToken?: boolean;
  hideAllowance?: boolean;
  onValueChange?: (paymentType: PaymentType) => void;
  onOptionChange?: (opt: {
    value: PaymentType;
    token?: TokenWithTradeInfo;
  }) => void;
}) {
  const account = useAccount();
  const { token: nativeTokenInfo } = useUserNativeToken(
    hideNativeToken ? undefined : account.address,
    hideNativeToken ? undefined : chain.id,
  );
  const { token: erc20Token } = useUserToken(
    account.address,
    DEGEN_TOKEN_ADDRESS,
    chain.id,
  );
  const erc20TokenInfo = erc20Token
    ? ({
        ...erc20Token,
        logoURI: DEGEN_TOKEN_METADATA.logoURI,
      } as TokenWithTradeInfo)
    : undefined;

  const opts: Array<PaymentOption> = [
    ...(hideAllowance
      ? []
      : [{ value: PaymentType.Allowance, label: "Allowance" }]),
    ...(nativeTokenInfo
      ? [
          {
            value: PaymentType.NativeToken,
            label: nativeTokenInfo?.symbol || "",
            token: nativeTokenInfo,
          },
        ]
      : []),
    ...(erc20TokenInfo
      ? [
          {
            value: PaymentType.Erc20,
            label: erc20TokenInfo?.symbol || "",
            token: erc20TokenInfo,
          },
        ]
      : []),
  ];
  if (opts.length < 2) {
    return null;
  }
  return (
    <View className="flex-row rounded-lg border-2 border-secondary">
      {opts?.map((opt) => (
        <Pressable
          key={opt.value}
          className={cn(
            "flex-1 flex-row items-center justify-center gap-2 p-1",
            selectedValue === opt.value ? "bg-secondary" : "",
          )}
          disabled={selectedValue === opt.value}
          onPress={() => {
            onValueChange?.(opt.value);
            onOptionChange?.(opt);
          }}
        >
          <Text className="text-white">{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
