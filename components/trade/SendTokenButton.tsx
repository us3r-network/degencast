import { forwardRef, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Address,
  Chain,
  TransactionReceipt,
  isAddress,
  parseEther,
} from "viem";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ArrowUp } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN_ADDRESS } from "~/constants";
import { useERC20Transfer } from "~/hooks/trade/useERC20Contract";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { shortPubKey } from "~/utils/shortPubKey";
import { TokenWithValue } from "../common/TokenInfo";
import { Input } from "../ui/input";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import UserTokenSelect from "./UserTokenSelect";
import { eventBus, EventTypes } from "~/utils/eventBus";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { Slider } from "../ui/slider";

export default function SendTokenButton({
  defaultChain = DEFAULT_CHAIN,
}: {
  defaultChain?: Chain;
}) {
  // console.log("SendButton tokens", availableTokens);
  const [sending, setSending] = useState(false);
  const { connectWallet, connectedWallets, activeWallet } = useWalletAccount();

  if (!activeWallet?.address)
    return (
      <Button
        size={"icon"}
        className="rounded-full"
        onPress={() => connectWallet()}
      >
        <Text>
          <ArrowUp />
        </Text>
      </Button>
    );
  else
    return (
      <Dialog
        onOpenChange={() => {
          setSending(false);
        }}
      >
        <DialogTrigger
          asChild
          disabled={
            activeWallet?.connectorType !== "embedded" &&
            activeWallet?.connectorType !== "coinbase_wallet"
          }
        >
          <Button size={"icon"} className="rounded-full">
            <Text>
              <ArrowUp />
            </Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>{!sending ? "Withdraw" : "Transaction"}</DialogTitle>
          </DialogHeader>
          <SendToken chain={defaultChain} setSending={setSending} />
        </DialogContent>
      </Dialog>
    );
}

const SendToken = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    chain: Chain;
    setSending?: (swaping: boolean) => void;
  }
>(({ className, chain, setSending, ...props }, ref) => {
  const account = useAccount();

  const [address, setAddress] = useState<`0x${string}`>();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();

  const { embededWallet } = useWalletAccount();
  useEffect(() => {
    if (embededWallet) setAddress(embededWallet.address as `0x${string}`);
  }, [embededWallet]);

  useEffect(() => {
    if (token) {
      setAmount(String(token.balance) || "0");
    }
  }, [token]);

  const [transationData, setTransationData] = useState<TransationData>();
  const [transationError, setTransationError] = useState<string>();

  const updateTransationData = useCallback(
    (transactionReceipt: TransactionReceipt | undefined) => {
      if (token && address && isAddress(address) && Number(amount) > 0) {
        const transationData = {
          chain,
          transactionReceipt,
          description: (
            <View className="flex w-full items-center gap-2">
              <View className="w-full flex-row items-center justify-between gap-2">
                <Text className="font-medium text-secondary">From</Text>
                <Text className="font-medium text-secondary">
                  {shortPubKey(account?.address as string)}
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-between gap-2">
                <Text className="font-medium text-secondary">To</Text>
                <Text className="font-medium text-secondary">
                  {shortPubKey(address)}
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-between gap-2">
                <Text className="font-medium text-secondary">Value</Text>
                <TokenWithValue token={token} value={amount} />
              </View>
            </View>
          ),
        };
        setTransationData(transationData);
        setSending?.(true);
      }
    },
    [address, token, amount],
  );

  const updateTransationError = useCallback((transactionError: string) => {
    if (transactionError) {
      setTransationData(undefined);
      setTransationError(transactionError || "Transaction failed!");
    }
  }, []);

  const tryAgain = () => {
    setTransationData(undefined);
    setTransationError(undefined);
    setSending?.(false);
    setAmount("0");
  };

  if (transationData)
    return (
      <TransactionInfo
        type={ONCHAIN_ACTION_TYPE.SEND_TOKEN}
        data={transationData}
        buttonText="Trade more"
        buttonAction={tryAgain}
      />
    );
  else if (transationError)
    return (
      <ErrorInfo
        error={transationError}
        buttonText="Try Again"
        buttonAction={tryAgain}
      />
    );
  else
    return (
      <View className="flex gap-4">
        <View className="flex gap-2">
          <View className="flex-row items-center justify-between">
            <Text>Wallet address</Text>
            <Text className="text-sm">
              Only sending on {DEFAULT_CHAIN.name}
            </Text>
          </View>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter wallet address"
            value={address}
            onChangeText={(newText) => setAddress(newText as `0x${string}`)}
          />
        </View>
        <View className="flex gap-2">
          <Text>Token</Text>
          <UserTokenSelect selectToken={setToken} chain={chain} />
        </View>
        <View className="flex gap-2">
          <Text>Amount</Text>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
            editable={!transationData}
          />
          <Slider
            value={Number(amount)}
            max={Number(token?.balance || 0)}
            step={Number(token?.balance || 0) / 100}
            onValueChange={(v) => setAmount(String(v))}
            disabled={!!transationData}
          />
        </View>
        {token && (
          <OnChainActionButtonWarper
            variant="secondary"
            className="mt-6"
            targetChainId={token.chainId}
            warpedButton={
              address && isAddress(address) && Number(amount) > 0 ? (
                token.address === NATIVE_TOKEN_ADDRESS ? (
                  <SendNativeTokenButton
                    disabled={
                      !address || Number(amount) > Number(token?.balance || 0)
                    }
                    address={address}
                    amount={amount}
                    token={token}
                    transationReceiptChange={updateTransationData}
                    transationErrorChange={updateTransationError}
                  />
                ) : (
                  <SendERC20TokenButton
                    disabled={
                      !address || Number(amount) > Number(token?.balance || 0)
                    }
                    address={address}
                    amount={amount}
                    token={token}
                    transationReceiptChange={updateTransationData}
                    transationErrorChange={updateTransationError}
                  />
                )
              ) : (
                <Button disabled variant="secondary">
                  <Text>Enter address and amount</Text>
                </Button>
              )
            }
          />
        )}
      </View>
    );
});

type SendTokenProps = {
  address: Address;
  amount: string;
  token: TokenWithTradeInfo;
  transationReceiptChange: (
    transactionReceipt: TransactionReceipt | undefined,
  ) => void;
  transationErrorChange: (transactionError: string) => void;
};

const SendNativeTokenButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SendTokenProps
>(
  (
    {
      address,
      amount,
      token,
      transationReceiptChange,
      transationErrorChange,
      ...props
    },
    ref,
  ) => {
    const {
      data: hash,
      isPending,
      sendTransaction,
      error,
      reset,
    } = useSendTransaction();
    const {
      data: transactionReceipt,
      error: transactionError,
      isLoading: transationLoading,
      isSuccess,
      status: transationStatus,
    } = useWaitForTransactionReceipt({
      hash,
    });

    const send = async () => {
      // console.log("Send", { address, amount, token });
      if (address && amount && token) {
        sendTransaction({ to: address, value: parseEther(amount) });
      }
    };

    useEffect(() => {
      if (isSuccess && transactionReceipt) {
        eventBus.next({
          type: EventTypes.NATIVE_TOKEN_BALANCE_CHANGE,
        });
        transationReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transationErrorChange((error as any)?.details);
      } else if (transactionError) {
        transationErrorChange((transactionError as any)?.details);
      }
    }, [error, transactionError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transationLoading}
        onPress={send}
      >
        <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
      </Button>
    );
  },
);

const SendERC20TokenButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SendTokenProps
>(
  (
    {
      address,
      amount,
      token,
      transationReceiptChange,
      transationErrorChange,
      ...props
    },
    ref,
  ) => {
    const {
      transfer,
      error,
      isPending,
      isSuccess,
      transactionReceipt,
      transationError,
      transationLoading,
      transationStatus,
    } = useERC20Transfer({ contractAddress: token.address });

    const send = async () => {
      console.log("Send", { address, amount, token });
      if (address && amount && token) {
        transfer(address, parseEther(amount));
      }
    };

    useEffect(() => {
      if (isSuccess && transactionReceipt) {
        eventBus.next({
          type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE,
        });
        transationReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transationErrorChange((error as any)?.details);
      } else if (transationError) {
        transationErrorChange((transationError as any)?.details);
      }
    }, [error, transationError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transationLoading}
        onPress={send}
      >
        <Text>{isPending ? "Confirming..." : `Withdraw ${token.name}`}</Text>
      </Button>
    );
  },
);
