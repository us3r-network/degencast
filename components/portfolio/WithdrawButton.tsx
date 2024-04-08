import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Pressable, Text, TextInput, View } from "react-native";
import { parseEther } from "viem";
import { base } from "viem/chains";
import { useSendTransaction } from "wagmi";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { TokenInfo } from "./tokens/TokenInfo";
import { TokenInfoWithMetadata } from "~/services/user/types";
import { round } from "lodash";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "~/lib/utils";

export default function WithdrawButton({
  defaultAddress,
  defaultChain = base.id,
  availableTokens,
}: {
  defaultAddress: `0x${string}`;
  defaultChain?: number;
  availableTokens: TokenInfoWithMetadata[];
}) {
  console.log("SendButton tokens", availableTokens);
  const [address, setAddress] = useState(defaultAddress);
  const [amount, setAmount] = useState("");
  const [tokens, setTokens] = useState<TokenInfoWithMetadata[] | undefined>(
    availableTokens,
  );
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>(
    availableTokens?.length > 0 ? availableTokens[0] : undefined,
  );
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const send = async () => {
    console.log("Send", { address, amount, token });
    sendTransaction({ to: address, value: parseEther(amount) });
  };
  useEffect(() => {
    console.log("tokens change", availableTokens);
    if (availableTokens?.length > 0) {
      setTokens(availableTokens);
      setToken(availableTokens[0]);
    }
  }, [availableTokens]);
  useEffect(() => {
    if (token) {
      setAmount(String(token?.balance) || "0");
    }
  }, [token]);
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Pressable>
          <Text className="font-bold text-secondary">Withdraw</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className="w-[400px] text-primary-foreground">
        <DialogTitle className="text-md font-bold">Withdraw</DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">
              Wallet address
            </Text>
            <Text className="text-sm text-secondary">Only sending on Base</Text>
          </View>
          <TextInput
            className="w-full rounded-md border border-secondary p-2"
            placeholder="Enter wallet address"
            value={address}
            onChangeText={(newText) => setAddress(newText as `0x${string}`)}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">Token</Text>
          </View>
          {tokens && tokens.length > 0 && (
            <ToeknSelect tokens={tokens} selectToken={setToken} />
          )}
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">Amount</Text>
          </View>
          <TextInput
            className="w-full rounded-md border border-secondary p-2"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
          />
          <Button
            disabled={isPending}
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            onPress={send}
          >
            {isPending ? "Confirming..." : "Withdraw"}
          </Button>
          {hash && <Text>Transaction Hash: {hash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}

function ToeknSelect({
  tokens,
  selectToken,
}: {
  tokens: TokenInfoWithMetadata[];
  selectToken: (token: TokenInfoWithMetadata) => void;
}) {
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
            className={cn(
              "bg-white"
            )}
            aria-labelledby={`label-for-${token.contractAddress}`}
            key={token.contractAddress}
            value={token.contractAddress}
          />
          <Text className="text-lg font-bold text-white">{token.name}</Text>
          <Text className="text-secondary">
            {round(Number(token.balance), 4)} available
          </Text>
        </View>
      ))}
    </RadioGroup>
  );
}

/*
function ToeknSelect({
  tokens,
  selectToken,
}: {
  tokens: TokenInfoWithMetadata[];
  selectToken: (token: TokenInfoWithMetadata) => void;
}) {
  const defaultToken = tokens[0];
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>(
    defaultToken,
  );
  return (
    <Select
      className="w-full"
      defaultValue={{
        value: defaultToken?.contractAddress || "",
        label: defaultToken?.name || "",
      }}
      onValueChange={async (item) => {
        const newToken = tokens?.find(
          (token) => token.contractAddress === item?.value,
        );
        if (newToken) {
          setToken(newToken);
          selectToken(newToken);
        }
      }}
    >
      <SelectTrigger className="w-full">
        {token && (
          <View className="w-full flex-row items-center justify-between">
            <TokenInfo {...token} />
            <Text className="text-white">
              {round(Number(token?.balance), 4)} available
            </Text>
          </View>
        )}
      </SelectTrigger>
      <SelectContent className="z-10 h-[400px] w-full">
        {tokens?.map((token) => (
          <SelectItem
            key={token.contractAddress}
            value={token.contractAddress}
            label={token.name || token.contractAddress}
          >
            <View className="w-full flex-row items-center justify-between">
              <TokenInfo {...token} />
              <Text>{round(Number(token.balance), 4)} available</Text>
            </View>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
*/
