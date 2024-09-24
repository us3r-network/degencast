import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { useAccount } from "wagmi";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
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
import useCurationTokenInfo from "~/hooks/user/useCurationTokenInfo";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { ERC42069Token } from "~/services/trade/types";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "../common/TranasactionResult";
import BurnNFT from "./ATTBurnNFT";
import { ActivityScene, DetailsScene, NftCtx } from "./ATTShared";

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
