import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN } from "~/constants";
import useUserTokens, { TOKENS } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { Option } from "../primitives/select";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

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

  const valueChangeHandler = (item: Option) => {
    setValue(item?.value);
    const newToken = tokens?.find((token) => token?.address === item?.value);
    if (newToken) {
      selectToken?.(newToken);
    }
  };
  const DEFAULT_VALUE: Option = {
    label: tokens[0].name || "",
    value: tokens[0].address,
  };
  useEffect(() => {
    if (tokens?.length > 0) {
      valueChangeHandler(DEFAULT_VALUE);
    }
  }, [userTokens, tokens, supportTokenKeys]);

  const selectedToken =
    tokens?.find((token) => token?.address === value) || tokens[0];

  if (hidden) {
    return null;
  }
  // return (
  //   <RadioGroup
  //     value={value}
  //     onValueChange={valueChangeHandler}
  //     className="gap-3"
  //   >
  //     {tokens?.map((token) => (
  //       <View key={token.address} className="w-full flex-row items-center gap-4">
  //         <RadioGroupItem
  //           className={cn("bg-white")}
  //           aria-labelledby={`label-for-${token.address}`}
  //           key={token.address}
  //           value={token.address}
  //         />
  //         <TokenInfo
  //           name={token.name}
  //           logo={token.logoURI}
  //         />
  //         <Text className="text-secondary">
  //           {Number(token.balance).toFixed(4)} {token.symbol}
  //         </Text>
  //       </View>
  //     ))}
  //   </RadioGroup>
  // );
  return (
    <Select  className={cn("z-10")}
      defaultValue={{
        value: selectedToken.address,
        label: selectedToken.name || "",
      }}
      onValueChange={valueChangeHandler}
    >
      <SelectTrigger className={cn("w-full border-secondary px-2")}>
        <View className="flex-row items-center gap-6">
          <TokenInfo name={selectedToken.name} logo={selectedToken.logoURI} />
          <Text className="text-secondary">
            {Number(selectedToken.balance).toFixed(4)} {selectedToken.symbol}
          </Text>
        </View>
      </SelectTrigger>
      <SelectContent className={cn("bg-primary border-secondary p-0")}>
        {/* <View className="flex items-start gap-4 divide-solid"> */}
        {tokens?.map((token) => (
          <SelectItem
            asChild
            className={cn("web:focus:bg-accent/10 p-0")}
            key={token.address}
            label={token.name || ""}
            value={token.address}
          >
            <View
              key={token.address}
              className="w-full flex-row items-center gap-4 p-1"
            >
              <TokenInfo name={token.name} logo={token.logoURI} />
              <Text className="text-secondary">
                {Number(token.balance).toFixed(4)} {token.symbol}
              </Text>
            </View>
          </SelectItem>
        ))}
        {/* </View> */}
      </SelectContent>
    </Select>
  );
}
