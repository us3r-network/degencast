import React, { forwardRef, LegacyRef, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import About from "~/components/common/About";
import NFTImage from "~/components/common/NFTImage";
import NumberField from "~/components/common/NumberField";
import { TokenWithValue } from "~/components/common/TokenInfo";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Button, ButtonProps } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTFactoryContractBurn,
  useATTFactoryContractInfo,
  useATTFactoryContractMint,
} from "~/hooks/trade/useATTFactoryContract";
import { getTokenInfo } from "~/hooks/trade/useERC20Contract";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { createToken } from "~/services/trade/api";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import { TokenActivitieList } from "../activity/Activities";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";

export function SellButton({ token }: { token: ERC42069Token }) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const [showDetails, setShowDetails] = useState(false);
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={() => connectWallet()}
      >
        <Text>Sell</Text>
      </Button>
    );
  else
    return (
      <Dialog
        onOpenChange={() => {
          setTransationData(undefined);
          setError("");
        }}
      >
        <DialogTrigger asChild>
          <Button className={cn("w-14")} size="sm" variant={"secondary"}>
            <Text>Sell</Text>
          </Button>
        </DialogTrigger>
        {!transationData && !error && (
          <DialogContent className="w-screen">
            <DialogHeader className={cn("mr-4 flex-row items-center")}>
              <Pressable
                disabled={!showDetails}
                onPress={() => setShowDetails(false)}
              >
                <Text className={showDetails ? "text-secondary" : "text-white"}>
                  Burn Channel NFT
                </Text>
              </Pressable>
              <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
              <Pressable
                disabled={showDetails}
                onPress={() => setShowDetails(true)}
              >
                <Text
                  className={!showDetails ? "text-secondary" : "text-white"}
                >
                  Details
                </Text>
              </Pressable>
            </DialogHeader>
            {showDetails ? (
              <TokenActivitieList token={token} />
            ) : (
              <>
                <View className="flex-row items-center justify-between gap-2">
                  <Text>Active Wallet</Text>
                  <UserWalletSelect />
                </View>
                <BurnNFT
                  nft={token}
                  onSuccess={setTransationData}
                  onError={setError}
                />
              </>
            )}
          </DialogContent>
        )}
        {transationData && (
          <DialogContent className="w-screen">
            <DialogHeader className={cn("flex gap-2")}>
              <DialogTitle>Transaction</DialogTitle>
            </DialogHeader>
            <TransactionInfo
              data={transationData}
              buttonText="Sell more"
              buttonAction={() => setTransationData(undefined)}
            />
          </DialogContent>
        )}
        {error && (
          <DialogContent className="w-screen">
            <DialogHeader className={cn("flex gap-2")}>
              <DialogTitle>Error</DialogTitle>
            </DialogHeader>
            <ErrorInfo
              error={error}
              buttonText="Try Again"
              buttonAction={() => setError("")}
            />
          </DialogContent>
        )}
      </Dialog>
    );
}

const BurnNFT = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    nft: ERC42069Token;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, nft, onSuccess, onError, ...props }, ref) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);

  const {
    burn,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useATTFactoryContractBurn(nft);

  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text className="text-white">Sell {amount} badges and receive</Text>
            <TokenWithValue token={token} value={nftPrice} />
          </View>
        ),
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      onError?.(
        writeError?.message || transationError?.message || "Something Wrong!",
      );
    }
  }, [writeError, transationError]);

  const { nftBalanceOf } = useATTContractInfo(nft);
  const { data: balance } = nftBalanceOf(account?.address);

  const { getBurnNFTPriceAfterFee, getPaymentToken } =
    useATTFactoryContractInfo(nft);

  const { paymentToken } = getPaymentToken();
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>(undefined);
  useEffect(() => {
    if (paymentToken && account?.address)
      getTokenInfo({
        address: paymentToken,
        chainId: ATT_CONTRACT_CHAIN.id,
        account: account?.address,
      }).then((tokenInfo) => {
        // console.log("paymentToken tokenInfo", paymentToken, tokenInfo);
        setToken(tokenInfo);
      });
  }, [paymentToken, account?.address]);
  const { nftPrice } = getBurnNFTPriceAfterFee(amount);
  return (
    <View className="flex gap-4">
      <NFTImage nft={nft} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {nftPrice && amount && token && token.decimals ? (
            <Text className="text-xs">
              {formatUnits(nftPrice / BigInt(amount), token.decimals)}
              {token?.symbol} per badge
            </Text>
          ) : (
            <Text className="text-xs">calculating price...</Text>
          )}
        </View>
        <NumberField
          defaultValue={1}
          minValue={1}
          maxValue={Number(balance)}
          onChange={setAmount}
        />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-medium">Receive:</Text>
        {nftPrice && amount && token && token.decimals ? (
          <Text className="text-md">
            {formatUnits(nftPrice, token.decimals)} {token.symbol}
          </Text>
        ) : (
          <Text className="text-md">fetching price...</Text>
        )}
      </View>
      <OnChainActionButtonWarper
        variant="secondary"
        className="w-full"
        targetChainId={ATT_CONTRACT_CHAIN.id}
        warpedButton={
          <Button
            variant="secondary"
            className="w-full"
            disabled={!account || waiting || writing || !balance}
            onPress={() => burn(amount)}
          >
            <Text>{waiting || writing ? "Confirming..." : "Sell"}</Text>
          </Button>
        }
      />
    </View>
  );
});

export function BuyButton({
  token,
  renderButton,
}: {
  token: ERC42069Token;
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
}) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const [open, setOpen] = useState(false);
  const handlePress = () => {
    if (!account.address) {
      connectWallet();
      return;
    }
    setOpen(true);
  };
  return (
    <Pressable>
      {renderButton ? (
        renderButton({ onPress: handlePress })
      ) : (
        <Button
          className={cn("w-14")}
          size="sm"
          variant={"secondary"}
          onPress={handlePress}
        >
          <Text>Mint</Text>
        </Button>
      )}

      {account.address && (
        <BuyDialog token={token} open={open} onOpenChange={setOpen} />
      )}
    </Pressable>
  );
}

export function BuyDialog({
  token,
  open,
  onOpenChange,
}: {
  token: ERC42069Token;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setTransationData(undefined);
        setError("");
        onOpenChange(o);
      }}
    >
      {!transationData && !error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("mr-4 flex-row items-center")}>
            <Pressable
              disabled={!showDetails}
              onPress={() => setShowDetails(false)}
            >
              <Text className={showDetails ? "text-secondary" : "text-white"}>
                Mint Channel NFT
              </Text>
            </Pressable>
            <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
            <Pressable
              disabled={showDetails}
              onPress={() => setShowDetails(true)}
            >
              <Text className={!showDetails ? "text-secondary" : "text-white"}>
                Details
              </Text>
            </Pressable>
          </DialogHeader>
          {showDetails ? (
            <TokenActivitieList token={token} />
          ) : (
            <>
              <View className="flex-row items-center justify-between gap-2">
                <Text>Active Wallet</Text>
                <UserWalletSelect />
              </View>
              <MintNFT
                nft={token}
                onSuccess={setTransationData}
                onError={setError}
              />
              <DialogFooter>
                <About title={ATT_TITLE} info={ATT_INFO} />
              </DialogFooter>
            </>
          )}
        </DialogContent>
      )}
      {transationData && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionInfo
            data={transationData}
            buttonText="Mint more"
            buttonAction={() => setTransationData(undefined)}
          />
        </DialogContent>
      )}
      {error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <ErrorInfo
            error={error}
            buttonText="Try Again"
            buttonAction={() => setError("")}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

const MintNFT = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    nft: ERC42069Token;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, nft, onSuccess, onError, ...props }, ref) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);
  const {
    mint,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useATTFactoryContractMint(nft);

  const { getMintNFTPrice, getPaymentToken } = useATTFactoryContractInfo(nft);

  const { paymentToken } = getPaymentToken();
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>(undefined);
  useEffect(() => {
    if (paymentToken && account?.address)
      getTokenInfo({
        address: paymentToken,
        chainId: ATT_CONTRACT_CHAIN.id,
        account: account?.address,
      }).then((tokenInfo) => {
        // console.log("paymentToken tokenInfo", paymentToken, tokenInfo);
        setToken(tokenInfo);
      });
  }, [paymentToken, account?.address]);
  const { nftPrice } = getMintNFTPrice(amount);
  const fetchedPrice = !!(nftPrice && amount && token && token.decimals);
  const perNFTPrice = fetchedPrice
    ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
    : "";
  // console.log("fetchedPrice", fetchedPrice, nftPrice, amount, token);
  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text>Miny {amount} nfts and cost</Text>
            <TokenWithValue token={token} value={nftPrice} />
          </View>
        ),
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      onError?.(
        writeError?.message || transationError?.message || "Something Wrong!",
      );
    }
  }, [writeError, transationError]);

  const allowanceParams =
    account?.address && token?.address && nftPrice
      ? {
          owner: account.address,
          tokenAddress: token?.address,
          spender: ATT_FACTORY_CONTRACT_ADDRESS,
          value: nftPrice,
        }
      : undefined;
  return (
    <View className="flex gap-4">
      <NFTImage nft={nft} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {fetchedPrice ? (
            <Text className="text-xs">
              {perNFTPrice}
              {token?.symbol} per badge
            </Text>
          ) : (
            <Text className="text-xs text-secondary">calculating price...</Text>
          )}
        </View>
        <NumberField defaultValue={1} minValue={1} onChange={setAmount} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-medium">Total Cost</Text>
        {fetchedPrice && nftPrice ? (
          <Text>
            {formatUnits(nftPrice, token.decimals!)} {token.symbol}
          </Text>
        ) : (
          <Text>fetching price...</Text>
        )}
      </View>
      <OnChainActionButtonWarper
        variant="secondary"
        className="w-full"
        targetChainId={ATT_CONTRACT_CHAIN.id}
        allowanceParams={allowanceParams}
        warpedButton={
          <Button
            variant="secondary"
            className="w-full"
            disabled={
              !account ||
              !nftPrice ||
              waiting ||
              writing ||
              Number(token?.rawBalance || 0) < Number(nftPrice)
            }
            onPress={() => {
              if (nftPrice) mint(amount, nftPrice);
            }}
          >
            <Text>{waiting || writing ? "Confirming..." : "Mint"}</Text>
          </Button>
        }
      />
    </View>
  );
});

export const ATT_TITLE = "About Proposal, upvote & channel NFT";
export const ATT_INFO = [
  "Propose: Turn a cast into a Channel NFT.",
  "Approve: Approved proposal = Channel NFT.",
  "Curators: After proposal is approved, top 10 upvoters(include proposer) = curators. The earlier the more revenue.",
  "NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, ,Curators 4%.",
  "All Channel NFTs share a same channel bonding curve.",
  "When channel bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
  "Channel NFT holders could claim airdrops after channel token launch.",
];

export const CreateTokenButton = forwardRef(function (
  {
    channelId,
    onComplete,
    text,
    renderBottonContent,
    ...props
  }: ButtonProps & {
    channelId: string;
    onComplete?: (tokenAddress: Address) => void;
    text?: string;
    renderBottonContent?: () => React.ReactNode;
  },
  ref: LegacyRef<typeof Button>,
) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size="sm"
      className="w-14"
      variant="secondary"
      disabled={loading}
      onPress={async () => {
        setLoading(true);
        const resp = await createToken(channelId);
        console.log(resp);
        const attentionTokenAddr = resp.data?.data?.dn42069TokenAddress;
        if (attentionTokenAddr) {
          Toast.show({
            type: "success",
            text1: "Token Created",
            text2: "You can now trade your token",
          });
          onComplete?.(resp.data.data.dn42069TokenAddress);
        } else {
          Toast.show({
            type: "error",
            text1: "Token Creation Failed",
            text2: "Please try again later",
          });
          setLoading(false);
          return;
        }
      }}
      {...props}
    >
      {renderBottonContent ? (
        renderBottonContent()
      ) : (
        <Text>{text || `Create`}</Text>
      )}
    </Button>
  );
});
