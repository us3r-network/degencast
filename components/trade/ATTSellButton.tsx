import { forwardRef, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import NFTImage from "~/components/common/NFTImage";
import NumberField from "~/components/common/NumberField";
import { TokenWithValue } from "~/components/common/TokenInfo";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTBurnNFT,
  useATTFactoryContractInfo,
} from "~/hooks/trade/useATTFactoryContract";
import useATTNftInfo from "~/hooks/trade/useATTNftInfo";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { ERC42069Token } from "~/services/trade/types";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import DialogTabBar from "../layout/tab-view/DialogTabBar";
import { ActivityScene, DetailsScene, NftCtx } from "./ATTBuyButton";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import useCurationTokenInfo from "~/hooks/user/useCurationTokenInfo";
import { fetchItems as fetchUserCommunityNFTs } from "~/features/user/communityNFTsSlice";
import { fetchItems as fetchUserCommunityTokens } from "~/features/user/communityTokensSlice";
import { useDispatch } from "react-redux";
import { UnknownAction } from "@reduxjs/toolkit";

export function SellButton({ token }: { token: ERC42069Token }) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const { tokenInfo } = useCurationTokenInfo(
    token.contractAddress,
    token.tokenId,
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "nft", title: "NFT" },
    { key: "details", title: "Details" },
    { key: "activity", title: "Activity" },
  ]);

  const BurnNFTScene = () => (
    <ScrollView
      className="max-h-[70vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-2">
          <Text>Active Wallet</Text>
          <UserWalletSelect />
        </View>
        <BurnNFT nft={token} onSuccess={setTransationData} onError={setError} />
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    nft: BurnNFTScene,
    details: DetailsScene,
    activity: ActivityScene,
  });

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
          <DialogContent
            className="w-screen"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <NftCtx.Provider
              value={{
                token,
              }}
            >
              <TabView
                swipeEnabled={false}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={DialogTabBar}
              />
            </NftCtx.Provider>
          </DialogContent>
        )}
        {transationData && (
          <DialogContent
            className="w-screen"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader className={cn("flex gap-2")}>
              <DialogTitle>Transaction</DialogTitle>
            </DialogHeader>
            <TransactionInfo
              type={ONCHAIN_ACTION_TYPE.BURN_NFT}
              data={transationData}
              cast={tokenInfo?.cast}
              buttonText="Sell more"
              buttonAction={() => setTransationData(undefined)}
            />
          </DialogContent>
        )}
        {error && (
          <DialogContent
            className="w-screen"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
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
  const dispatch = useDispatch();
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
  } = useATTBurnNFT(nft);

  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text className="text-white">Sell {amount} NFTs and receive</Text>
            {graduated ? (
              <TokenWithValue
                token={nftTokenInfo!}
                value={tokenUnit! * BigInt(amount)}
              />
            ) : (
              <TokenWithValue token={token} value={nftPrice} />
            )}
          </View>
        ),
      };
      onSuccess?.(transationData);
      setTimeout(() => {
        if (account?.address) {
          dispatch(
            fetchUserCommunityNFTs(account.address) as unknown as UnknownAction,
          );
          if (graduated)
            dispatch(
              fetchUserCommunityTokens(
                account.address,
              ) as unknown as UnknownAction,
            );
        }
      }, 5000);
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
  const { token, graduated, tokenUnit, nftTokenInfo } = useATTNftInfo({
    tokenContract: nft.contractAddress,
  });
  const { getBurnNFTPriceAfterFee } = useATTFactoryContractInfo({
    contractAddress: nft.contractAddress,
    tokenId: 0,
  });
  const { nftPrice } = getBurnNFTPriceAfterFee(amount);

  return (
    <View className="flex gap-4">
      <NFTImage nft={nft} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {graduated ? (
            tokenUnit && !!nftTokenInfo ? (
              <Text className="text-xs">
                {formatUnits(tokenUnit, nftTokenInfo.decimals || 18)}{" "}
                {nftTokenInfo.symbol} per NFT
              </Text>
            ) : (
              <Text className="text-xs">calculating price...</Text>
            )
          ) : nftPrice && amount && token && token.decimals ? (
            <Text className="text-xs">
              {formatUnits(nftPrice / BigInt(amount), token.decimals)}
              {token?.symbol} per NFT
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
        {graduated ? (
          tokenUnit && !!nftTokenInfo ? (
            <Text className="text-xs">
              {formatUnits(
                tokenUnit * BigInt(amount),
                nftTokenInfo.decimals || 18,
              )}{" "}
              {nftTokenInfo.symbol}
            </Text>
          ) : (
            <Text className="text-xs">calculating price...</Text>
          )
        ) : nftPrice && amount && token && token.decimals ? (
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
