import { round } from "lodash";
import { useState } from "react";
import { Text, View } from "react-native";
import useUserTokens from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenInfoWithMetadata } from "~/services/user/types";
import { TokenInfo } from "../common/TokenInfo";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function ToeknSelect({
  selectToken,
}: {
  selectToken: (token: TokenInfoWithMetadata) => void;
}) {
  const { userTokens } = useUserTokens();
  const tokens = Array.from(userTokens, ([name, value]) => value);

  const defaultToken = tokens[0];
  const [value, setValue] = useState(defaultToken?.contractAddress);
  return (
    <RadioGroup
      value={value}
      onValueChange={async (item) => {
        setValue(item);
        const newToken = tokens?.find(
          (token) => token.contractAddress === item,
        );
        if (newToken) {
          selectToken(newToken);
        }
      }}
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
          <TokenInfo name={token.name} logo={token.logo} />
          <Text className="text-secondary">
            {round(Number(token.balance), 4)} available
          </Text>
        </View>
      ))}
    </RadioGroup>
  );
}
