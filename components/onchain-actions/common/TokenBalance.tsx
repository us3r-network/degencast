import React, { useEffect } from "react";
import { NATIVE_TOKEN_METADATA } from "~/constants";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import * as Slot from "@rn-primitives/slot";
import type { SlottableViewProps } from "@rn-primitives/types";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";
import { useChains } from "wagmi";
import { Text } from "~/components/ui/text";
import { eventBus, EventTypes } from "~/utils/eventBus";
import { useFocusEffect } from "expo-router";

const balanceVariants = cva("", {
  variants: {
    variant: {
      default: "",
      big: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const balanceTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
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
  const { token: nativeTokenInfo, refetch } = useUserNativeToken(
    address,
    chainId,
  );
  const balance = nativeTokenInfo?.balance || "0";
  const chains = useChains();
  const chain = chains.find((chain) => chain.id === chainId);
  const symbol = chain?.nativeCurrency.symbol || "";

  useEffect(() => {
    const subscription = refetch
      ? eventBus.subscribe((event) => {
          // console.log("event", event);
          if ((event as any).type === EventTypes.NATIVE_TOKEN_BALANCE_CHANGE)
            refetch?.();
        })
      : null;
    return () => {
      subscription?.unsubscribe();
    };
  }, [refetch]);

  useFocusEffect(() => {
    refetch?.();
  });

  useEffect(() => {
    if (balance) setBalance?.(Number(balance));
  }, [balance, setBalance]);

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
  const { token: erc20TokenInfo, refetch } = useUserToken(
    address,
    token.address,
    token.chainId,
  );
  const balance = erc20TokenInfo?.balance || "0";
  const symbol = token.symbol || "";
  useEffect(() => {
    if (balance) setBalance?.(Number(balance));
  }, [balance, setBalance]);
  const Component = asChild ? Slot.View : TokenBalance;

  useEffect(() => {
    const subscription = refetch
      ? eventBus.subscribe((event) => {
          // console.log("event", event);
          if ((event as any).type === EventTypes.ERC20_TOKEN_BALANCE_CHANGE) {
            refetch?.();
          }
        })
      : null;
    return () => {
      subscription?.unsubscribe();
    };
  }, [refetch]);
  useFocusEffect(() => {
    refetch?.();
  });
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
