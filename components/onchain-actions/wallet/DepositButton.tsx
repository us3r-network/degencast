import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  formatUnits,
  http,
  parseEther,
} from "viem";
import { ArrowDown, Copy } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import {
  DEFAULT_CHAIN,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_METADATA,
} from "~/constants";
import useWalletAccount, {
  ConnectedWallet,
} from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { eventBus, EventTypes } from "~/utils/eventBus";
import { shortPubKey } from "~/utils/shortPubKey";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import FundButton from "./FundButton";
import UserTokenSelect from "../common/UserTokenSelect";

export default function DepositButton({
  renderButton,
}: {
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
}) {
  const { activeWallet } = useWalletAccount();
  const [open, setOpen] = useState(false);
  return (
    <>
      {renderButton ? (
        renderButton({ onPress: () => setOpen(true) })
      ) : (
        <Button
          size={"icon"}
          className="rounded-full"
          onPress={() => setOpen(true)}
          disabled={
            !activeWallet ||
            (activeWallet?.connectorType !== "embedded" &&
              activeWallet?.connectorType !== "coinbase_wallet")
          }
        >
          <Text>
            <ArrowDown color="white"/>
          </Text>
        </Button>
      )}
      <DepositDialog open={open} setOpen={setOpen} />
    </>
  );
}

export function DepositDialog({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (mintNum: number) => void;
}) {
  const {
    connectWallet,
    activeWallet,
    connectedInjectedWallet,
    setFreezeAutoSwitchActiveWallet,
  } = useWalletAccount();

  useEffect(() => {
    if (open) {
      console.log("freeze");
      setFreezeAutoSwitchActiveWallet(true);
    } else {
      console.log("unfreeze");
      setFreezeAutoSwitchActiveWallet(false);
    }
  }, [open]);

  if (activeWallet) {
    return (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Deposit</DialogTitle>
          </DialogHeader>
          <ScrollView
            className="max-h-[70vh] w-full"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex gap-6">
              <UserTokens address={activeWallet.address as Address} />
              <View className=" w-full flex-row items-center justify-between gap-2 rounded-lg border-2 border-secondary/50">
                <Text className="ml-2 line-clamp-1 flex-1 text-secondary/50">
                  {activeWallet.address as Address}
                </Text>
                <Button
                  size="icon"
                  variant="ghost"
                  onPress={async (event) => {
                    await Clipboard.setStringAsync(
                      activeWallet.address as Address,
                    );
                    Toast.show({
                      type: "info",
                      text1: "Wallet Address Copied!",
                    });
                  }}
                >
                  <Copy className="size-4 text-white" />
                </Button>
              </View>
              <Text className="text-sm">
                Copy the wallet address and paste it into your crypto wallet to
                transfer. Only sending on Base.
              </Text>
              <FundButton variant="text" />
              {!!connectedInjectedWallet ? (
                <TransferFromExternalWallet
                  fromWallet={connectedInjectedWallet}
                  toWallet={activeWallet}
                />
              ) : (
                <Button
                  variant="secondary"
                  onPress={() =>
                    connectWallet()
                  }
                >
                  <Text>Connect your wallet & transfer</Text>
                </Button>
              )}
            </View>
          </ScrollView>
        </DialogContent>
      </Dialog>
    );
  }
}
function TransferFromExternalWallet({
  fromWallet,
  toWallet,
}: {
  fromWallet: ConnectedWallet;
  toWallet: ConnectedWallet;
}) {
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState(0);
  const [transfering, setTransfering] = useState(false);

  useEffect(() => {
    if (!fromWallet || !token || transfering) return;
    const publicClient = createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(),
    });
    if (token.address === NATIVE_TOKEN_ADDRESS)
      publicClient
        .getBalance({
          address: fromWallet.address as Address,
        })
        .then((rawBalance) => {
          const b = parseFloat(
            formatUnits(rawBalance, NATIVE_TOKEN_METADATA.decimals!),
          );
          setBalance(b);
          setAmount(String(b / 5));
        });
    else
      publicClient
        .readContract({
          address: token.address as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [fromWallet.address as Address],
        })
        .then((rawBalance) => {
          const b = parseFloat(formatUnits(rawBalance, token.decimals!));
          setBalance(b);
          setAmount(String(b / 10));
        });
  }, [fromWallet, transfering, token]);

  const transfer = async () => {
    if (!fromWallet || !toWallet || !token || transfering) return;
    const value = parseEther(amount);
    try {
      setTransfering(true);
      const provider = await fromWallet.getEthereumProvider();
      const client = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(provider),
      });
      // console.log("client", client, fromWallet, toWallet, value)
      if (client.chain.id !== DEFAULT_CHAIN.id)
        await client.switchChain(DEFAULT_CHAIN);
      let hash;
      if (token.address === NATIVE_TOKEN_ADDRESS) {
        hash = await client.sendTransaction({
          account: fromWallet.address as Address,
          to: toWallet.address as Address,
          value,
        });
      } else {
        hash = await client.writeContract({
          address: token.address,
          abi: erc20Abi,
          functionName: "transfer",
          args: [toWallet.address as Address, value],
          account: fromWallet.address as Address,
        });
      }
      const publicClient = createPublicClient({
        chain: DEFAULT_CHAIN,
        transport: http(),
      });
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
        // confirmations: 5,
      });
      Toast.show({
        type: "success",
        text1: "Transfer Completed!",
        // text2: `Transaction Hash: ${hash}`,
      });
      if (token.address === NATIVE_TOKEN_ADDRESS)
        eventBus.next({ type: EventTypes.NATIVE_TOKEN_BALANCE_CHANGE });
      else eventBus.next({ type: EventTypes.ERC20_TOKEN_BALANCE_CHANGE });
      setTransfering(false);
    } catch (e: any) {
      console.log("error", e);
      Toast.show({
        type: "error",
        text1: "Failed to transfer",
      });
      setTransfering(false);
    }
  };

  return (
    <View className="flex gap-4">
      <Text className="text-sm">
        Transfer from connected wallet: {shortPubKey(fromWallet.address)}
      </Text>
      <UserTokenSelect selectToken={setToken} chain={DEFAULT_CHAIN} />
      <Input
        className="border-secondary text-secondary"
        placeholder="Enter amount"
        value={amount}
        onChangeText={(newText) => setAmount(newText)}
        editable={!transfering}
      />
      <Slider
        value={Number(amount)}
        max={balance}
        step={balance / 100}
        onValueChange={(v) => setAmount(String(v))}
        disabled={transfering}
      />
      {token && (
        <Button
          variant="secondary"
          disabled={transfering}
          onPress={() => transfer()}
        >
          <Text>
            Transfer{" "}
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 4,
              notation: "compact",
            }).format(Number(amount))}{" "}
            {token.symbol}
          </Text>
        </Button>
      )}
    </View>
  );
}
