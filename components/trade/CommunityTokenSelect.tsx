import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Text } from "~/components/ui/text";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { Option } from "../primitives/select";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export default function CommunityTokenSelect({
  chainId,
  defaultToken,
  selectToken,
  showBalance = false,
}: {
  chainId: number;
  defaultToken?: TokenWithTradeInfo;
  selectToken?: (token: TokenWithTradeInfo) => void;
  showBalance?: boolean;
}) {
  const { items: communityTokens } = useCommunityTokens();

  const tokens: TokenWithTradeInfo[] = useMemo(() => {
    // console.log("communityTokens", communityTokens, chainId, defaultToken);
    if (
      defaultToken &&
      communityTokens.findIndex(
        (token) => token.address === defaultToken.address,
      ) < 0
    ) {
      return [defaultToken, ...communityTokens].filter(
        (token) => Number(token?.chainId) === chainId,
      );
    } else {
      return communityTokens.filter((token) => token?.chainId === chainId);
    }
  }, [communityTokens, defaultToken]);

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

  if (!tokens || tokens.length === 0) {
    return (
      <View>
        <Text>No Community Token!</Text>
      </View>
    );
  }
  const selectedToken =
    tokens?.find((token) => token?.address === value) || tokens[0];

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
              {Number(selectedToken.balance).toFixed(4)} {selectedToken.symbol}
            </Text>
          )}
        </View>
      </SelectTrigger>
      <SelectContent
        side="bottom"
        className={cn("max-h-72 border-secondary bg-primary p-0")}
      >
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
              {showBalance && (
                <Text className="text-secondary">
                  {Number(token.balance).toFixed(4)} {token.symbol}
                </Text>
              )}
            </View>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
