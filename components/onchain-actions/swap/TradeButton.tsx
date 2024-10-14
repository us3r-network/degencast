import { upperFirst } from "lodash";
import { LegacyRef, forwardRef } from "react";
import { View } from "react-native";
import { useAccount } from "wagmi";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  DEFAULT_CHAINID,
  DEGEN_TOKEN_METADATA,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { ArrowUpDown } from "../../common/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import TradeModal from "./TradeModal";
import useAppModals from "~/hooks/useAppModals";

export default function SwapButton() {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!account.address)
    return (
      <Button
        size={"icon"}
        className="rounded-full"
        onPress={() => connectWallet()}
      >
        <Text>
          <ArrowUpDown color="white"/>
        </Text>
      </Button>
    );
  else
    return (
      <TradeModal
        token1={NATIVE_TOKEN_METADATA}
        token2={DEGEN_TOKEN_METADATA}
        triggerButton={
          <Button size={"icon"} className="rounded-full">
            <Text>
              <ArrowUpDown />
            </Text>
          </Button>
        }
      />
    );
}

export function TradeButton({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
  className,
  onOpenBefore,
}: {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
  className?: string;
  onOpenBefore?: () => void;
}) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const { setTradeTokenModal } = useAppModals();
  return (
    <Button
      className={cn("w-14", className)}
      size="sm"
      variant={"secondary"}
      disabled={
        (!token1 && !token2) ||
        token1.chainId !== DEFAULT_CHAINID ||
        token2.chainId !== DEFAULT_CHAINID
      }
      onPress={() => {
        if (!account.address) {
          connectWallet();
          return;
        }
        if (onOpenBefore) {
          onOpenBefore();
        }
        setTradeTokenModal({
          open: true,
          token1,
          token2,
        });
      }}
    >
      <Text>Trade</Text>
    </Button>
  );
}

export function ExploreTradeButton({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
  ...props
}: ButtonProps & {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
}) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();

  const symbol = token2?.symbol || "";
  const logo = token2?.logoURI || "";
  if (!account.address)
    return (
      <ExploreTradeStyledButton
        name={symbol}
        logo={logo}
        onPress={() => connectWallet()}
        {...props}
      />
    );
  else
    return (
      <TradeModal
        token1={token1}
        token2={token2}
        triggerButton={
          <ExploreTradeStyledButton
            name={symbol}
            logo={logo}
            disabled={
              (!token1 && !token2) ||
              token1.chainId !== DEFAULT_CHAINID ||
              token2.chainId !== DEFAULT_CHAINID
            }
            {...props}
          />
        }
      />
    );
}

export function TradeChannelTokenButton({
  token1 = NATIVE_TOKEN_METADATA,
  token2 = NATIVE_TOKEN_METADATA,
  ...props
}: ButtonProps & {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
}) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();

  const symbol = token2?.symbol || "";
  const logo = token2?.logoURI || "";

  if (!account.address)
    return (
      <TradeChannelTokenStyledButton
        name={symbol}
        logo={logo}
        onPress={() => connectWallet()}
        {...props}
      />
    );
  else
    return (
      <TradeModal
        token1={token1}
        token2={token2}
        triggerButton={
          <TradeChannelTokenStyledButton
            name={symbol}
            logo={logo}
            disabled={
              (!token1 && !token2) ||
              token1.chainId !== DEFAULT_CHAINID ||
              token2.chainId !== DEFAULT_CHAINID
            }
            {...props}
          />
        }
      />
    );
}

const ExploreTradeStyledButton = forwardRef(function (
  {
    name,
    logo,
    className,
    ...props
  }: ButtonProps & {
    name: string;
    logo: string;
  },
  ref: LegacyRef<View>,
) {
  return (
    <Button
      className={cn(
        "h-[60px] flex-row items-center gap-1 rounded-[20px] bg-secondary px-[12px] py-[6px]",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Text className=" text-2xl font-bold">Trade</Text>
      {logo && (
        <Avatar alt={name || ""} className={cn(" size-6")}>
          <AvatarImage source={{ uri: logo || "" }} />
          <AvatarFallback>
            <Text className="text-sm font-medium">
              {upperFirst(name?.slice(0, 2))}
            </Text>
          </AvatarFallback>
        </Avatar>
      )}
      {name && (
        <Text className={cn("line-clamp-1 text-2xl font-bold")}>{name}</Text>
      )}
    </Button>
  );
});

const TradeChannelTokenStyledButton = forwardRef(function (
  {
    name,
    logo,
    className,
    ...props
  }: ButtonProps & {
    name: string;
    logo: string;
  },
  ref: LegacyRef<View>,
) {
  return (
    <Button
      className={cn(
        "h-[50px] flex-row items-center gap-1 px-[12px] py-[6px]",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Text className=" text-base font-bold">Trade</Text>
      {logo && (
        <Avatar alt={name || ""} className={cn(" size-5")}>
          <AvatarImage source={{ uri: logo || "" }} />
          <AvatarFallback>
            <Text className="text-sm font-medium">
              {upperFirst(name?.slice(0, 2))}
            </Text>
          </AvatarFallback>
        </Avatar>
      )}
      {name && (
        <Text className={cn("line-clamp-1 text-base font-bold")}>{name}</Text>
      )}
    </Button>
  );
});
