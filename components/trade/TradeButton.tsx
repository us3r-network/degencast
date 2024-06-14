import { useConnectWallet } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { DEGEN_METADATA, NATIVE_TOKEN_METADATA } from "~/constants";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import TradeModal from "./TradeModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { upperFirst } from "lodash";
import { ArrowUpDown } from "../common/Icons";
import { LegacyRef, forwardRef } from "react";
import { View } from "react-native";

export default function SwapButton() {
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (!account.address)
    return (
      <Button size={"icon"} className="rounded-full" onPress={connectWallet}>
        <Text>
          <ArrowUpDown />
        </Text>
      </Button>
    );
  else
    return (
      <TradeModal
        token1={NATIVE_TOKEN_METADATA}
        token2={DEGEN_METADATA}
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
}: {
  token1?: TokenWithTradeInfo;
  token2?: TokenWithTradeInfo;
}) {
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={connectWallet}
      >
        <Text>Trade</Text>
      </Button>
    );
  else
    return (
      <TradeModal
        token1={token1}
        token2={token2}
        triggerButton={
          <Button
            className={cn("w-14")}
            size="sm"
            variant={"secondary"}
            disabled={
              (!token1 && !token2) ||
              token1.chainId !== base.id ||
              token2.chainId !== base.id
            }
          >
            <Text>Trade</Text>
          </Button>
        }
      />
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
  const { connectWallet } = useConnectWallet();

  const symbol = token2?.symbol || "";
  const logo = token2?.logoURI || "";
  if (!account.address)
    return (
      <ExploreTradeStyledButton
        name={symbol}
        logo={logo}
        onPress={connectWallet}
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
              token1.chainId !== base.id ||
              token2.chainId !== base.id
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
          <AvatarFallback className="bg-secondary">
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
