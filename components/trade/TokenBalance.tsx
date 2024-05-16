import React from "react";
import { NATIVE_TOKEN_METADATA } from "~/constants";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import * as Slot from "~/components/primitives/slot";
import type { SlottableViewProps } from "~/components/primitives/types";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";
import { useChains } from "wagmi";
import { Text } from "~/components/ui/text";

const balanceVariants = cva(
  "web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary web:hover:opacity-80 active:opacity-80",
        secondary:
          "border-transparent bg-secondary web:hover:opacity-80 active:opacity-80",
        destructive:
          "border-transparent bg-destructive web:hover:opacity-80 active:opacity-80",
        outline: "text-foreground",
        big: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const balanceTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      big: "text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type NativeToeknBalanceProps = SlottableViewProps &
  VariantProps<typeof balanceVariants> & {
    chainId: number;
    address: `0x${string}` | undefined;
    setBalance?: (balance: number) => void;
  };

function NativeTokenBalance({
  chainId = NATIVE_TOKEN_METADATA.chainId,
  address,
  setBalance,
  className,
  variant,
  asChild,
  ...props
}: NativeToeknBalanceProps) {
  const nativeTokenInfo = useUserNativeToken(address, chainId);
  const balance = nativeTokenInfo?.balance || "0";
  const chains = useChains();
  const chain = chains.find((chain) => chain.id === chainId);
  const symbol = chain?.nativeCurrency.symbol || "";
  setBalance?.(Number(balance));
  const Component = asChild ? Slot.View : TokenBalance;
  return (
    <TextClassContext.Provider value={balanceTextVariants({ variant })}>
      <Component
        className={cn(balanceVariants({ variant }), className)}
        balance={balance}
        symbol={variant === "big" ? "" : symbol}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

type ERC20ToeknBalanceProps = SlottableViewProps &
  VariantProps<typeof balanceVariants> & {
    token: TokenWithTradeInfo;
    address: `0x${string}` | undefined;
    setBalance?: (balance: number) => void;
  };

function ERC20TokenBalance({
  token,
  address,
  setBalance,
  className,
  variant,
  asChild,
  ...props
}: ERC20ToeknBalanceProps) {
  const tokenInfo = useUserToken(address, token.address, token.chainId);
  const balance = tokenInfo?.balance || "0";
  const symbol = token.symbol || "";
  setBalance?.(Number(balance));
  const Component = asChild ? Slot.View : TokenBalance;
  return (
    <TextClassContext.Provider value={balanceTextVariants({ variant })}>
      <Component
        className={cn(balanceVariants({ variant }), className)}
        balance={balance}
        symbol={variant === "big" ? "" : symbol}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TokenBalance({
  balance,
  symbol,
}: {
  balance: string | number;
  symbol: string;
}) {
  return (
    <View className="flex-row items-center gap-1">
      <Text>
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
          notation: "compact",
        }).format(Number(balance) || 0)}
      </Text>
      <Text>{symbol}</Text>
    </View>
  );
}
export {
  NativeTokenBalance,
  ERC20TokenBalance,
  balanceVariants,
  balanceTextVariants,
};
export type { NativeToeknBalanceProps, ERC20ToeknBalanceProps };
