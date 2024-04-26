import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { TokenInfo } from "~/components/common/TokenInfo";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN } from "~/constants";
import useUserTokens, { TOKENS } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";

export default function MyToeknSelect({
  chain = DEFAULT_CHAIN,
  supportTokenKeys,
  selectToken,
  hidden = false,
}: {
  chain?: Chain;
  supportTokenKeys?: TOKENS[];
  selectToken?: (token: TokenWithTradeInfo) => void;
  hidden?: boolean;
}) {
  const account = useAccount();
  const { userTokens } = useUserTokens(account.address, chain.id);

  const tokens: TokenWithTradeInfo[] = useMemo(() => {
    const items: TokenWithTradeInfo[] = [];
    userTokens.forEach((value, key) => {
      if (!supportTokenKeys || supportTokenKeys.includes(key as TOKENS)) {
        items.push(value);
      }
    });
    return items;
  }, [userTokens, supportTokenKeys]);

  const [value, setValue] = useState<string>();

  const valueChangeHandler = (item: string) => {
    setValue(item);
    const newToken = tokens?.find((token) => token?.address === item);
    if (newToken) {
      selectToken?.(newToken);
    }
  };

  useEffect(() => {
    if (tokens?.length > 0) {
      valueChangeHandler(tokens[0].address);
    }
  }, [userTokens, tokens, supportTokenKeys]);

  if (hidden) {
    return null;
  }
  return (
    <RadioGroup
      value={value}
      onValueChange={valueChangeHandler}
      className="gap-3"
    >
      {tokens?.map((token) => (
        <View className="w-full flex-row items-center gap-4">
          <RadioGroupItem
            className={cn("bg-white")}
            aria-labelledby={`label-for-${token.address}`}
            key={token.address}
            value={token.address}
          />
          <TokenInfo
            name={token.name}
            logo={token.logoURI}
            textClassName="text-primary-foreground"
          />
          <Text className="text-secondary">
            {Number(token.balance).toFixed(4)}
          </Text>
        </View>
      ))}
    </RadioGroup>
  );
}
