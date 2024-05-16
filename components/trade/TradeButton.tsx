import { useConnectWallet } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_METADATA } from "~/constants";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import TradeModal from "./TradeModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { upperFirst } from "lodash";

export default function TradeButton({
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

  const name = token2?.name || "";
  const logo = token2?.logoURI || "";
  if (!account.address)
    return (
      <ExploreTradeStyledButton
        name={name}
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
            name={name}
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

function ExploreTradeStyledButton({
  name,
  logo,
  className,
  ...props
}: ButtonProps & {
  name: string;
  logo: string;
}) {
  return (
    <Button
      className={cn(
        "h-[50px] flex-row items-center gap-1 px-[12px] py-[6px]",
        className,
      )}
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
}
