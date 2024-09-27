import { forwardRef, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Address,
  Chain,
  encodeFunctionData,
  erc20Abi,
  isAddress,
  parseEther,
  parseUnits,
  TransactionReceipt,
} from "viem";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ArrowUp } from "~/components/common/Icons";
import { TokenWithValue } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN_ADDRESS } from "~/constants";
import { useERC20Transfer } from "~/hooks/trade/useERC20Contract";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { eventBus, EventTypes } from "~/utils/eventBus";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { shortPubKey } from "~/utils/shortPubKey";
import OnChainActionButtonWarper from "../common/OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "../common/TranasactionResult";
import UserTokenSelect from "../common/UserTokenSelect";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export default function SendTokenButton({
  defaultChain = DEFAULT_CHAIN,
}: {
  defaultChain?: Chain;
}) {
  // console.log("SendButton tokens", availableTokens);
  const [sending, setSending] = useState(false);
  const { connectWallet, activeWallet, injectedWallet } = useWalletAccount();

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
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>{!sending ? "Withdraw" : "Transaction"}</DialogTitle>
          </DialogHeader>
          <SendToken
            chain={defaultChain}
            setSending={setSending}
            defaultAddress={injectedWallet?.address as Address}
          />
        </DialogContent>
      </Dialog>
    );
}

const SendToken = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    defaultAddress: Address | undefined;
    chain: Chain;
    setSending?: (swaping: boolean) => void;
  }
>(({ className, defaultAddress, chain, setSending, ...props }, ref) => {
  const account = useAccount();
  const { usePrivySmartWallet } = useWalletAccount();
  const [address, setAddress] = useState<`0x${string}`>(defaultAddress || "0x");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();
  useEffect(() => {
    if (token) {
      setAmount(String(token.balance) || "0");
    }
  }, [token]);

  const [transactionData, setTransationData] = useState<TransationData>();
  const [transactionError, setTransationError] = useState<string>();

  const updateTransationData = useCallback(
    (transactionReceipt: TransactionReceipt | undefined) => {
      if (token && address && isAddress(address) && Number(amount) > 0) {
        const transactionData = {
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
        setTransationData(transactionData);
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

  if (transactionData)
    return (
      <TransactionInfo
        type={ONCHAIN_ACTION_TYPE.SEND_TOKEN}
        data={transactionData}
        buttonText="Trade more"
        buttonAction={tryAgain}
      />
    );
  else if (transactionError)
    return (
      <ErrorInfo
        error={transactionError}
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
            editable={!transactionData}
          />
          <Slider
            value={Number(amount)}
            max={Number(token?.balance || 0)}
            step={Number(token?.balance || 0) / 100}
            onValueChange={(v) => setAmount(String(v))}
            disabled={!!transactionData}
          />
        </View>
        {token && (
          <OnChainActionButtonWarper
            variant="secondary"
            className="mt-6"
            targetChainId={token.chainId}
            warpedButton={
              address && isAddress(address) && Number(amount) > 0 ? (
                usePrivySmartWallet ? (
                  token.address === NATIVE_TOKEN_ADDRESS ? (
                    <SendNativeTokenFromPrivySmartWalletButton
                      disabled={
                        !address || Number(amount) > Number(token?.balance || 0)
                      }
                      address={address}
                      amount={amount}
                      token={token}
                      transactionReceiptChange={updateTransationData}
                      transactionErrorChange={updateTransationError}
                    />
                  ) : (
                    <SendERC20TokenFromPrivySmartWalletButton
                      disabled={
                        !address || Number(amount) > Number(token?.balance || 0)
                      }
                      address={address}
                      amount={amount}
                      token={token}
                      transactionReceiptChange={updateTransationData}
                      transactionErrorChange={updateTransationError}
                    />
                  )
                ) : token.address === NATIVE_TOKEN_ADDRESS ? (
                  <SendNativeTokenButton
                    disabled={
                      !address || Number(amount) > Number(token?.balance || 0)
                    }
                    address={address}
                    amount={amount}
                    token={token}
                    transactionReceiptChange={updateTransationData}
                    transactionErrorChange={updateTransationError}
                  />
                ) : (
                  <SendERC20TokenButton
                    disabled={
                      !address || Number(amount) > Number(token?.balance || 0)
                    }
                    address={address}
                    amount={amount}
                    token={token}
                    transactionReceiptChange={updateTransationData}
                    transactionErrorChange={updateTransationError}
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
  transactionReceiptChange: (
    transactionReceipt: TransactionReceipt | undefined,
  ) => void;
  transactionErrorChange: (transactionError: string) => void;
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
      transactionReceiptChange,
      transactionErrorChange,
      ...props
    },
    ref,
  ) => {
    const {
      data: hash,
      isPending,
      sendTransaction,
      error,
      // reset,
    } = useSendTransaction();
    const {
      data: transactionReceipt,
      error: transactionError,
      isLoading: transactionLoading,
      isSuccess,
      // status: transactionStatus,
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
        transactionReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transactionErrorChange((error as any)?.details);
      } else if (transactionError) {
        transactionErrorChange((transactionError as any)?.details);
      }
    }, [error, transactionError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transactionLoading}
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
      transactionReceiptChange,
      transactionErrorChange,
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
      transactionError,
      transactionLoading,
      transactionStatus,
    } = useERC20Transfer({ contractAddress: token.address });

    const send = async () => {
      console.log("Send", { address, amount, token });
      if (address && amount && token) {
        transfer(address, parseUnits(amount, token?.decimals || 18));
      }
    };

    useEffect(() => {
      if (isSuccess && transactionReceipt) {
        eventBus.next({
          type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE,
        });
        transactionReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transactionErrorChange((error as any)?.details);
      } else if (transactionError) {
        transactionErrorChange((transactionError as any)?.details);
      }
    }, [error, transactionError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transactionLoading}
        onPress={send}
      >
        <Text>{isPending ? "Confirming..." : `Withdraw ${token.name}`}</Text>
      </Button>
    );
  },
);

const SendNativeTokenFromPrivySmartWalletButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SendTokenProps
>(
  (
    {
      address,
      amount,
      token,
      transactionReceiptChange,
      transactionErrorChange,
      ...props
    },
    ref,
  ) => {
    const { client } = useSmartWallets();
    const [isPending, setIsPending] = useState(false);
    const [hash, setHash] = useState<`0x${string}` | undefined>();
    const [error, setError] = useState<Error>();
    const {
      data: transactionReceipt,
      error: transactionError,
      isLoading: transactionLoading,
      isSuccess,
      status: transactionStatus,
    } = useWaitForTransactionReceipt({
      hash,
    });
    const send = async () => {
      // console.log("Send", { address, amount, token });
      if (address && amount && token && client) {
        setIsPending(true);
        try {
          const txHash = await client.sendTransaction({
            account: client.account,
            chain: DEFAULT_CHAIN,
            to: address,
            value: parseEther(amount),
          });
          if (!txHash) {
            throw new Error("Error while sending transaction");
          }
          setHash(txHash);
        } catch (e) {
          setError(e as Error);
        } finally {
          setIsPending(false);
        }
      }
    };

    useEffect(() => {
      if (isSuccess && transactionReceipt) {
        eventBus.next({
          type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE,
        });
        transactionReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transactionErrorChange((error as any)?.details);
      } else if (transactionError) {
        transactionErrorChange((transactionError as any)?.details);
      }
    }, [error, transactionError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transactionLoading}
        onPress={send}
      >
        <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
      </Button>
    );
  },
);

const SendERC20TokenFromPrivySmartWalletButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SendTokenProps
>(
  (
    {
      address,
      amount,
      token,
      transactionReceiptChange,
      transactionErrorChange,
      ...props
    },
    ref,
  ) => {
    const { client } = useSmartWallets();
    const [isPending, setIsPending] = useState(false);
    const [hash, setHash] = useState<`0x${string}` | undefined>();
    const [error, setError] = useState<Error>();
    const {
      data: transactionReceipt,
      error: transactionError,
      isLoading: transactionLoading,
      isSuccess,
      status: transactionStatus,
    } = useWaitForTransactionReceipt({
      hash,
    });
    const { activeWallet } = useWalletAccount();
    const send = async () => {
      // console.log("Send", { address, amount, token });
      if (address && amount && token && client) {
        setIsPending(true);
        try {
          const txHash = await client.sendTransaction({
            account: client.account,
            chain: DEFAULT_CHAIN,
            to: token.address,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [address, parseUnits(amount, token?.decimals || 18)],
            }),
          });
          if (!txHash) {
            throw new Error("Error while sending transaction");
          }
          setHash(txHash);
        } catch (e) {
          setError(e as Error);
        } finally {
          setIsPending(false);
        }
      }
    };

    useEffect(() => {
      if (isSuccess && transactionReceipt) {
        eventBus.next({
          type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE,
        });
        transactionReceiptChange(transactionReceipt);
      }
    }, [isSuccess, transactionReceipt]);

    useEffect(() => {
      if (error) {
        transactionErrorChange((error as any)?.details);
      } else if (transactionError) {
        transactionErrorChange((transactionError as any)?.details);
      }
    }, [error, transactionError]);

    return (
      <Button
        variant={"secondary"}
        disabled={props.disabled || isPending || transactionLoading}
        onPress={send}
      >
        <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
      </Button>
    );
  },
);
