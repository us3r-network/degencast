import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import Toast from "react-native-toast-message";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { SceneMap, TabView } from "react-native-tab-view";
import { AboutContents } from "~/components/help/HelpButton";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { parseUnits } from "viem";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import ProposalCastCard from "../ProposalCastCard";
import {
  DisputeProposalWriteButton,
  ProposeProposalWriteButton,
} from "../proposal-write-buttons/ProposalWriteButton";
import useRoundProposals from "~/hooks/social-farcaster/proposal/useRoundProposals";
import { Button, ButtonProps } from "~/components/ui/button";
import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import useAppModals from "~/hooks/useAppModals";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";
import useDisputePrice from "~/hooks/social-farcaster/proposal/useDisputePrice";
import { SECONDARY_COLOR } from "~/constants";
import { DialogCastActivitiesList } from "~/components/activity/Activities";
import ProposalErrorModal from "./ProposalErrorModal";
import { getProposalErrorInfo } from "../utils";

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
    { key: "upvote", title: "Vote" },
    { key: "activity", title: "Activity" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    upvote: ProposedProposalModalContentBodyScene,
    activity: CastActivitiesListScene,
    about: AboutContents,
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

function CastActivitiesListScene() {
  const { cast } = useProposedProposalCtx();
  return (
    <View className="h-[500px] w-full">
      <DialogCastActivitiesList castHash={cast.hash} />
    </View>
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
    refetch,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
  });
  // const {
  //   price,
  //   isLoading: priceLoading,
  //   error: priceError,
  // } = useProposePrice({
  //   contractAddress: tokenInfo?.danContract!,
  //   castHash: cast.hash,
  // });
  const {
    price,
    isLoading: priceLoading,
    error: priceError,
  } = useDisputePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

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

  const minPayAmountNumber = tokenInfo?.danConfig?.proposalStake || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );

  const { upsertProposalShareModal } = useAppModals();

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  useEffect(() => {
    if (Number(proposal?.upvoteCount) === 1) {
      setSelectedPayAmount(minAmount);
    } else {
      if (!priceLoading && price) {
        setSelectedPayAmount(price);
      }
    }
  }, [price, priceLoading, proposal, minAmount]);

  const preAddress = useRef(address);
  useEffect(() => {
    if (minAmount) {
      setSelectedPayAmount(minAmount);
    }
  }, [minAmount]);
  useEffect(() => {
    if (preAddress.current !== address) {
      refetch();
      preAddress.current = address;
    }
  }, [address]);

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });
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
        {isLoading ? (
          <ActivityIndicator color={SECONDARY_COLOR} />
        ) : (
          <ProposalPaymentSelector
            paymentInfoType={PaymentInfoType.Proposed}
            defaultPaymentInfo={{
              tokenInfo: paymentTokenInfo!,
              recommendedAmount: price,
              minAmount: minAmount,
            }}
            selectedPaymentToken={selectedPaymentToken!}
            setSelectedPaymentToken={setSelectedPaymentToken}
            selectedPayAmount={selectedPayAmount!}
            setSelectedPayAmount={setSelectedPayAmount}
          />
        )}

        {isLoading ? null : participated ? (
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
              <DisputeProposalWriteButton
                approveText="Downvote (Approve)"
                downvoteText="Downvote"
                cast={cast}
                channel={channel}
                proposal={{ ...proposal, status: ProposalState.Accepted }}
                tokenInfo={tokenInfo}
                paymentTokenInfo={paymentTokenInfo!}
                usedPaymentTokenInfo={selectedPaymentToken}
                paymentTokenInfoLoading={paymentTokenInfoLoading}
                paymentAmount={selectedPayAmount!}
                onDisputeSuccess={() => {
                  setOpen(false);
                  Toast.show({
                    type: "success",
                    text1: "Submitted",
                  });
                  upsertProposalShareModal({
                    open: true,
                    cast,
                    channel,
                    proposal,
                  });
                }}
                onDisputeError={(error) => {
                  const errInfo = getProposalErrorInfo(error);
                  const { shortMessage, message } = errInfo;
                  if (message) {
                    setErrorModal({ open: true, message });
                  } else {
                    Toast.show({
                      type: "error",
                      text1: shortMessage,
                    });
                  }
                }}
              />
            </View>
            <View className="flex-1">
              <ProposeProposalWriteButton
                approveText="Upvote (Approve)"
                upvoteText="Upvote"
                cast={cast}
                channel={channel}
                proposal={{ ...proposal, status: ProposalState.Proposed }}
                tokenInfo={tokenInfo}
                paymentTokenInfo={paymentTokenInfo!}
                usedPaymentTokenInfo={selectedPaymentToken}
                paymentTokenInfoLoading={paymentTokenInfoLoading}
                paymentAmount={selectedPayAmount!}
                onProposeSuccess={() => {
                  Toast.show({
                    type: "success",
                    text1: "Voting speeds up success",
                  });
                  setOpen(false);
                  upsertProposalShareModal({
                    open: true,
                    cast,
                    channel,
                    proposal,
                  });
                }}
                onProposeError={(error) => {
                  const errInfo = getProposalErrorInfo(error);
                  const { shortMessage, message } = errInfo;
                  if (message) {
                    setErrorModal({ open: true, message });
                  } else {
                    Toast.show({
                      type: "error",
                      text1: shortMessage,
                    });
                  }
                }}
              />
            </View>
          </View>
        )}
      </View>
      <ProposalErrorModal
        open={errorModal.open}
        onOpenChange={(o) => {
          setErrorModal((pre) => ({ ...pre, open: o }));
        }}
        message={errorModal.message}
      />
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
