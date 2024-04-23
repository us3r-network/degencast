import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { TokenInfo } from "~/components/common/TokenInfo";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN } from "~/constants";
import useUserTokens, { TOKENS } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenInfoWithMetadata } from "~/services/user/types";

export default function MyToeknSelect({
  chain = DEFAULT_CHAIN,
  defaultTokenKey,
  supportTokenKeys,
  selectToken,
}: {
  chain?: Chain;
  defaultTokenKey?: TOKENS;
  supportTokenKeys?: TOKENS[];
  selectToken?: (token: TokenInfoWithMetadata) => void;
}) {
  const account = useAccount();
  const { userTokens } = useUserTokens(account.address, chain.id);
  const tokens: TokenInfoWithMetadata[] = useMemo(() => {
    const items: TokenInfoWithMetadata[] = [];
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
    const newToken = tokens?.find((token) => token?.contractAddress === item);
    if (newToken) {
      selectToken?.(newToken);
    }
  };

  useEffect(() => {
    if (tokens?.length > 0) {
      if (defaultTokenKey) {
        const token = tokens.find(
          (token) => token.contractAddress === defaultTokenKey,
        );
        if (token) {
          valueChangeHandler(token.contractAddress);
        } else {
          valueChangeHandler(tokens[0].contractAddress);
        }
      } else {
        valueChangeHandler(tokens[0].contractAddress);
      }
    }
  }, [defaultTokenKey, userTokens, tokens, supportTokenKeys]);

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
            aria-labelledby={`label-for-${token.contractAddress}`}
            key={token.contractAddress}
            value={token.contractAddress}
          />
          <TokenInfo
            name={token.name}
            logo={token.logo}
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
