import React, {
  useState
} from "react";
import { ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import useUserAction from "~/hooks/user/useUserAction";
import { cn } from "~/lib/utils";
import { UserActionName } from "~/services/user/types";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "../common/TranasactionResult";
import { ActivityScene, DetailsScene, NftCtx, NFTProps } from "./ATTShared";
import MintNFT from "./ATTMintNFT";

export default function BuyDialog({
  token,
  cast,
  open,
  setOpen,
  onSuccess,
}: NFTProps & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (mintNum: number) => void;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "nft", title: "NFT" },
    { key: "details", title: "Details" },
    { key: "activity", title: "Activity" },
  ]);

  const { submitUserAction } = useUserAction();
  const MintNFTScene = () => (
    <ScrollView
      className="max-h-[70vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-2">
          <Text>Active Wallet</Text>
          <UserWalletSelect />
        </View>
        <MintNFT
          nft={token}
          onSuccess={(data) => {
            setTransationData(data);
            onSuccess?.(data.amount || 0);
            submitUserAction({
              action: UserActionName.MintCast,
              castHash: cast?.hash,
              data: {
                hash: data?.transactionReceipt?.transactionHash,
              },
            });
          }}
          onError={setError}
        />
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    nft: MintNFTScene,
    details: DetailsScene,
    activity: ActivityScene,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setTransationData(undefined);
        setError("");
        setOpen(o);
      }}
    >
      {!transationData && !error && (
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <NftCtx.Provider
            value={{
              cast,
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
            type={ONCHAIN_ACTION_TYPE.MINT_NFT}
            cast={cast}
            data={transationData}
            buttonText="Mint more"
            buttonAction={() => setTransationData(undefined)}
            navigateToCreatePageAfter={() => setOpen(false)}
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