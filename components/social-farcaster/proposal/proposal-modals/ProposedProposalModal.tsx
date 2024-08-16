import { createContext, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import Toast from "react-native-toast-message";
import { UpvoteProposalModalContentBody } from "./UpvoteProposalModal";
import {
  ChallengeProposalWriteForm,
  PriceRangeRow,
} from "./ChallengeProposalModal";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { SceneMap, TabView } from "react-native-tab-view";
import { AboutProposalChallenge } from "./AboutProposal";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { formatUnits, TransactionReceipt } from "viem";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import ProposalCastCard from "../ProposalCastCard";
import PriceRow from "./PriceRow";
import { Slider } from "~/components/ui/slider";
import {
  DisputeProposalWriteButton,
  ProposeProposalWriteButton,
} from "../proposal-write-buttons/ProposalWriteButton";
import { getProposalMinPrice, getProposalPriceWithAmount } from "../utils";
import useRoundProposals from "~/hooks/social-farcaster/proposal/useRoundProposals";
import { Loading } from "~/components/common/Loading";
import { Button, ButtonProps } from "~/components/ui/button";
import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const ProposedProposalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useProposedProposalCtx = () => {
  const ctx = useContext(ProposedProposalCtx);
  if (!ctx) {
    throw new Error("useProposedProposalCtx must be used within a provider");
  }
  return ctx;
};
export default function ProposedProposalModal({
  cast,
  channel,
  proposal,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upvote", title: "Upvote" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    upvote: ProposedProposalModalContentBodyScene,
    about: AboutProposalChallenge,
  });
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <ProposedProposalCtx.Provider
          value={{
            cast,
            channel,
            proposal,
            tokenInfo,
            setOpen,
          }}
        >
          <TabView
            swipeEnabled={false}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={DialogTabBar}
          />
        </ProposedProposalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function ProposedProposalModalContentBodyScene() {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useProposedProposalCtx();
  const {
    participated,
    isLoading: proposalsLoading,
    proposals,
  } = useRoundProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const {
    price,
    isLoading: priceLoading,
    error: priceError,
  } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const [selectPrice, setSelectPrice] = useState<bigint | undefined>(undefined);
  useEffect(() => {
    if (!priceLoading && price) {
      console.log("price", price);
      setSelectPrice(price);
    }
  }, [price, priceLoading]);

  const isLoading = proposalsLoading || priceLoading || paymentTokenInfoLoading;

  const disabled =
    participated ||
    proposals?.state === ProposalState.Abandoned ||
    (proposals?.state === ProposalState.Accepted &&
      Number(proposals.roundIndex) > 1) ||
    proposals?.state === ProposalState.ReadyToMint ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    isLoading ||
    !price;

  const priceNumber =
    price && paymentTokenInfo?.decimals
      ? Number(formatUnits(price, paymentTokenInfo?.decimals!))
      : 0;
  const selectPriceNumber =
    selectPrice && paymentTokenInfo?.decimals
      ? Number(formatUnits(selectPrice, paymentTokenInfo?.decimals!))
      : 0;
  const priceSliderConfig = {
    value: paymentTokenInfo?.balance ? selectPriceNumber : 0,
    max: Number(paymentTokenInfo?.balance || 0),
    min: paymentTokenInfo?.balance
      ? tokenInfo?.bondingCurve?.basePrice || 0
      : 0,
    step: priceNumber / 100,
  };

  const minPrice = getProposalPriceWithAmount(
    priceSliderConfig.min,
    paymentTokenInfo!,
  );
  return (
    <ScrollView
      className="max-h-[80vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex w-full flex-col gap-4">
        <View className="flex-row items-center justify-between gap-2">
          <Text>Active Wallet</Text>
          <UserWalletSelect />
        </View>
        <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
        <PriceRow
          title="Minimum Cost"
          paymentTokenInfo={paymentTokenInfo}
          price={minPrice}
          isLoading={isLoading || paymentTokenInfoLoading}
          onClickPriceValue={() => {
            if (minPrice) {
              setSelectPrice(minPrice);
            }
          }}
        />
        <PriceRow
          title="Successfully Challenge"
          paymentTokenInfo={paymentTokenInfo}
          price={price}
          isLoading={isLoading || paymentTokenInfoLoading}
          onClickPriceValue={() => {
            if (price) {
              setSelectPrice(price);
            }
          }}
        />
        <View className="flex flex-col items-center gap-2">
          <Text className="text-center text-xs text-secondary">
            Upvote and earn minting fee rewards upon success!
          </Text>
          <Text className="text-center text-xs text-secondary">or</Text>
          <Text className="text-center text-xs text-secondary">
            Downvote spam casts, if you win, you can share the staked funds from
            upvoters.
          </Text>
        </View>

        <Slider
          {...priceSliderConfig}
          onValueChange={(v) => {
            if (!isNaN(Number(v))) {
              const decimalsStr = "0".repeat(paymentTokenInfo?.decimals!);
              const vInt = Math.ceil(Number(v));
              setSelectPrice(BigInt(`${vInt}${decimalsStr}`));
            }
          }}
        />
        <PriceRangeRow {...priceSliderConfig} />
        {isLoading ? (
          <View>
            <Loading />
          </View>
        ) : participated ? (
          <StatusButton disabled={disabled}>
            {proposals?.state === ProposalState.Accepted ? (
              <Text>You have already voted.</Text>
            ) : (
              <Text>You can only vote once in this round.</Text>
            )}
          </StatusButton>
        ) : proposals?.state === ProposalState.ReadyToMint ? (
          <StatusButton disabled={disabled}>
            <Text>The proposal has been passed</Text>
          </StatusButton>
        ) : proposals?.state === ProposalState.Abandoned ? (
          <StatusButton disabled={disabled}>
            <Text>The proposal has been abandoned</Text>
          </StatusButton>
        ) : proposals?.state === ProposalState.Accepted &&
          Number(proposals?.roundIndex) > 1 ? (
          <StatusButton disabled={disabled}>
            <Text>The proposal has been accepted</Text>
          </StatusButton>
        ) : !isConnected ? (
          <Text>Connect your wallet first</Text>
        ) : (
          <View className="flex flex-row items-center justify-between gap-5">
            <View className="flex-1">
              {" "}
              <DisputeProposalWriteButton
                approveText="Downvote (Approve)"
                downvoteText="Downvote"
                cast={cast}
                channel={channel}
                proposal={{ ...proposal, status: ProposalState.Accepted }}
                tokenInfo={tokenInfo}
                price={selectPrice!}
                onDisputeSuccess={() => {
                  setOpen(false);
                  Toast.show({
                    type: "success",
                    text1: "Submitted",
                  });
                }}
                onDisputeError={(error) => {
                  setOpen(false);
                  Toast.show({
                    type: "error",
                    // text1: "Challenges cannot be repeated this round",
                    text1: error.message,
                  });
                }}
              />
            </View>
            <View className="flex-1">
              <ProposeProposalWriteButton
                approveText="Upvote (Approve)"
                upvoteText="Upvote"
                cast={cast}
                channel={channel}
                tokenInfo={tokenInfo}
                price={price!}
                onProposeSuccess={() => {
                  Toast.show({
                    type: "success",
                    text1: "Voting speeds up success",
                  });
                  setOpen(false);
                }}
                onProposeError={(error) => {
                  Toast.show({
                    type: "error",
                    text1: error.message,
                  });
                  setOpen(false);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function StatusButton({ children, disabled }: ButtonProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  return (
    <Button
      variant={"secondary"}
      className="w-full rounded-md"
      disabled={disabled}
      onPress={() => {
        if (!isConnected) {
          connectWallet();
          return;
        }
      }}
    >
      {children}
    </Button>
  );
}