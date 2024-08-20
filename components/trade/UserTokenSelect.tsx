import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Text } from "~/components/ui/text";
import {
  DEFAULT_CHAIN,
  DEGEN_TOKEN_ADDRESS,
  DEGEN_TOKEN_METADATA,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import { useUserNativeToken, useUserToken } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { Option } from "../primitives/select";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { ERC20TokenBalance, NativeTokenBalance } from "./TokenBalance";

export default function UserTokenSelect({
  defaultToken,
  chain = DEFAULT_CHAIN,
  selectToken,
  showBalance = false,
  variant = "default",
}: {
  defaultToken?: TokenWithTradeInfo;
  chain?: Chain;
  selectToken?: (token: TokenWithTradeInfo) => void;
  showBalance?: boolean;
  variant?: "default" | "dropdown";
}) {
  const account = useAccount();
  const { token: nativeTokenInfo } = useUserNativeToken(
    account.address,
    chain.id,
  );
  const { token: erc20TokenInfo } = useUserToken(
    account.address,
    DEGEN_TOKEN_ADDRESS,
    chain.id,
  );

  const tokens: TokenWithTradeInfo[] = useMemo(() => {
    if (!nativeTokenInfo || !erc20TokenInfo) return [];
    return [
      nativeTokenInfo!,
      { ...erc20TokenInfo, logoURI: DEGEN_TOKEN_METADATA.logoURI }!,
    ];
  }, [nativeTokenInfo, erc20TokenInfo, defaultToken]);

  const [value, setValue] = useState<string>();

  const valueChangeHandler = (item: Option) => {
    setValue(item?.value);
    const newToken = tokens?.find((token) => token?.address === item?.value);
    if (newToken) {
      selectToken?.(newToken);
    }
  };
  const DEFAULT_VALUE: Option = {
    label: defaultToken?.name || tokens[0]?.name || "",
    value: defaultToken?.address || tokens[0]?.address,
  };
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      valueChangeHandler(DEFAULT_VALUE);
    }
  }, [tokens]);

  const selectedToken =
    tokens?.find((token) => token?.address === value) || tokens[0];

  if (!tokens || tokens.length === 0 || !selectedToken) {
    return null;
  }
  switch (variant) {
    case "dropdown":
      return (
        <Select
          defaultValue={DEFAULT_VALUE}
          value={{
            value: selectedToken.address,
            label: selectedToken.name || "",
          }}
          onValueChange={valueChangeHandler}
        >
          <SelectTrigger className={cn("w-full gap-6 border-none p-0")}>
            <View className="flex-row items-center gap-6">
              <TokenInfo
                name={selectedToken.name}
                logo={selectedToken.logoURI}
                symbol={selectedToken.symbol}
              />
              {showBalance && (
                <Text className="text-secondary">
                  {Number(selectedToken.balance).toFixed(4)}{" "}
                  {selectedToken.symbol}
                </Text>
              )}
            </View>
          </SelectTrigger>
          <SelectContent className={cn("border-secondary bg-primary p-0")}>
            {tokens?.map((token) => (
              <SelectItem
                asChild
                className={cn("p-0 web:focus:bg-accent/10")}
                key={token.address}
                label={token.name || ""}
                value={token.address}
              >
                <View
                  key={token.address}
                  className="w-full flex-row items-center gap-4 p-1"
                >
                  <TokenInfo
                    name={token.name}
                    logo={token.logoURI}
                    symbol={token.symbol}
                  />
                  {showBalance && account.address && token && (
                    <View className="flex-row items-center gap-2">
                      {token.address === NATIVE_TOKEN_METADATA.address ? (
                        <NativeTokenBalance
                          chainId={token.chainId}
                          address={account.address}
                        />
                      ) : (
                        <ERC20TokenBalance
                          token={token}
                          address={account.address}
                        />
                      )}
                    </View>
                  )}
                </View>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
    default:
      return (
        <View className="flex-row rounded-lg border-2 border-secondary">
          {tokens?.map((token) => (
            <Pressable
              key={token.address}
              className={cn(
                "flex-1 flex-row items-center justify-center gap-2 p-1",
                selectedToken === token ? "bg-secondary" : "",
              )}
              disabled={selectedToken === token}
              onPress={() => {
                setValue(token.address);
                selectToken?.(token);
              }}
            >
              <TokenInfo
                name={token.name}
                logo={token.logoURI}
                symbol={token.symbol}
              />
              {showBalance && account.address && token && (
                <View className="flex-row items-center gap-2">
                  {token.address === NATIVE_TOKEN_METADATA.address ? (
                    <NativeTokenBalance
                      chainId={token.chainId}
                      address={account.address}
                    />
                  ) : (
                    <ERC20TokenBalance
                      token={token}
                      address={account.address}
                    />
                  )}
                </View>
              )}
            </Pressable>
          ))}
        </View>
      );
  }
}
