import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalCastCard from "../ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import {
  ProposeProposalWriteButton,
  DisputeProposalWriteButton,
} from "../proposal-write-buttons/ProposalWriteButton";
import useDisputePrice from "~/hooks/social-farcaster/proposal/useDisputePrice";
import PriceRow from "./PriceRow";
import Toast from "react-native-toast-message";
import { formatUnits, parseUnits, TransactionReceipt } from "viem";
import { Slider } from "~/components/ui/slider";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { DialogCastActivitiesList } from "~/components/activity/Activities";
import { SceneMap, TabView } from "react-native-tab-view";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { AboutContents } from "~/components/help/HelpButton";
import useAppModals from "~/hooks/useAppModals";
import { Loading } from "~/components/common/Loading";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";
import { Button } from "~/components/ui/button";
import { useAccount } from "wagmi";
import { SECONDARY_COLOR } from "~/constants";
import { getProposalErrorInfo } from "../utils";
import ProposalErrorModal from "./ProposalErrorModal";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const ChallengeProposalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useChallengeProposalCtx = () => {
  const ctx = useContext(ChallengeProposalCtx);
  if (!ctx) {
    throw new Error("useChallengeProposalCtx must be used within a provider");
  }
  return ctx;
};
export default function ChallengeProposalModal({
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
    { key: "challenge", title: "Superlike" },
    { key: "activity", title: "Activity" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    challenge: ChallengeProposalContentBodyScene,
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
        <ChallengeProposalCtx.Provider
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
        </ChallengeProposalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function ChallengeProposalContentBodyScene() {
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useChallengeProposalCtx();
  return (
    <ScrollView
      className="max-h-[80vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <ChallengeProposalContentBody
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        onClose={() => {
          setOpen(false);
        }}
      />
    </ScrollView>
  );
}
function CastActivitiesListScene() {
  const { cast } = useChallengeProposalCtx();
  return (
    <View className="h-[500px] w-full">
      <DialogCastActivitiesList castHash={cast.hash} />
    </View>
  );
}
function ChallengeProposalContentBody({
  cast,
  channel,
  proposal,
  tokenInfo,
  onClose,
}: CastProposeStatusProps & {
  onClose: () => void;
}) {
  const { upsertProposalShareModal } = useAppModals();
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });
  return (
    <View className="flex w-full flex-col gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Cast Status:</Text>
        <Text className="text-sm">
          {proposal.status === ProposalState.Disputed
            ? "👎Dislike"
            : "👍Superlike"}
        </Text>
      </View>

      {/* <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} /> */}

      <ChallengeProposalWriteForm
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        onDisputeSuccess={() => {
          onClose();
          Toast.show({
            type: "success",
            text1: "Submitted",
          });
          upsertProposalShareModal({ open: true, cast, channel, proposal });
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
        onProposeSuccess={() => {
          onClose();
          Toast.show({
            type: "success",
            text1: "Submitted",
          });
          upsertProposalShareModal({ open: true, cast, channel, proposal });
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
        onShare={() => {
          onClose();
          upsertProposalShareModal({
            open: true,
            cast,
            channel,
            proposal,
            description: "Share with more people to accelerate the challenge.",
          });
        }}
      />
      <ProposalErrorModal
        open={errorModal.open}
        onOpenChange={(o) => {
          setErrorModal((pre) => ({ ...pre, open: o }));
        }}
        message={errorModal.message}
      />
    </View>
  );
}

export type DisputeProposalWrite = CastProposeStatusProps & {
  onDisputeSuccess?: (proposal: TransactionReceipt) => void;
  onDisputeError?: (error: any) => void;
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
  onShare?: () => void;
};
export function ChallengeProposalWriteForm(
  props: CastProposeStatusProps & {
    onDisputeSuccess?: (proposal: TransactionReceipt) => void;
    onDisputeError?: (error: any) => void;
    onProposeSuccess?: (proposal: TransactionReceipt) => void;
    onProposeError?: (error: any) => void;
    onShare?: () => void;
  },
) {
  return props.proposal.status === ProposalState.Accepted ? (
    <DisputeProposalWrite {...props} />
  ) : (
    <ProposeProposalWrite {...props} />
  );
}

export function DisputeProposalWrite({
  cast,
  channel,
  proposal,
  tokenInfo,
  onDisputeSuccess,
  onDisputeError,
  onShare,
}: DisputeProposalWrite) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
    refetch,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
  });
  const {
    price,
    isLoading: priceLoading,
    error: priceError,
  } = useDisputePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const isLoading = priceLoading || paymentTokenInfoLoading;

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  useEffect(() => {
    if (!priceLoading && price) {
      setSelectedPayAmount(price);
    }
  }, [price, priceLoading]);

  const minPayAmountNumber = tokenInfo?.danConfig?.proposalStake || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );

  const { address } = useAccount();
  const preAddress = useRef(address);
  useEffect(() => {
    if (preAddress.current !== address) {
      refetch();
      preAddress.current = address;
    }
  }, [address]);
  return (
    <>
      {isLoading ? (
        <ActivityIndicator color={SECONDARY_COLOR} />
      ) : (
        <>
          <ProposalPaymentSelector
            paymentInfoType={PaymentInfoType.Challenge}
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
          {/* <Text className="text-center text-xs text-secondary">
            Share with more people to accelerate the challenge.
          </Text> */}
          <View className="flex-row items-center justify-between gap-4">
            <Button className="h-8 w-20 bg-white" onPress={onShare}>
              <Text className="text-xs text-primary">Share</Text>
            </Button>
            <View className="flex-1">
              <DisputeProposalWriteButton
                cast={cast}
                channel={channel}
                proposal={proposal}
                tokenInfo={tokenInfo}
                paymentTokenInfo={paymentTokenInfo!}
                usedPaymentTokenInfo={selectedPaymentToken}
                paymentTokenInfoLoading={paymentTokenInfoLoading}
                paymentAmount={selectedPayAmount!}
                onDisputeSuccess={onDisputeSuccess}
                onDisputeError={onDisputeError}
                approveText="👎 Dislike (Approve)"
              />
            </View>
          </View>
        </>
      )}
    </>
  );
}

export function ProposeProposalWrite({
  cast,
  channel,
  proposal,
  tokenInfo,
  onProposeSuccess,
  onProposeError,
  onShare,
}: DisputeProposalWrite) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
    refetch,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
  });
  const {
    price,
    isLoading: priceLoading,
    error: priceError,
  } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const isLoading = priceLoading || paymentTokenInfoLoading;
  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  useEffect(() => {
    if (!priceLoading && price) {
      setSelectedPayAmount(price);
    }
  }, [price, priceLoading]);

  const minPayAmountNumber = tokenInfo?.danConfig?.proposalStake || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );

  const { address } = useAccount();
  const preAddress = useRef(address);
  useEffect(() => {
    if (preAddress.current !== address) {
      refetch();
      preAddress.current = address;
    }
  }, [address]);
  return (
    <>
      {isLoading ? (
        <ActivityIndicator color={SECONDARY_COLOR} />
      ) : (
        <>
          <ProposalPaymentSelector
            paymentInfoType={PaymentInfoType.Upvote}
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
          {/* <Text className="text-center text-xs text-secondary">
            Share with more people to accelerate the challenge.
          </Text> */}
          <View className="flex-row items-center justify-between gap-4">
            <Button className="h-8 w-20 bg-white" onPress={onShare}>
              <Text className="text-xs text-primary">Share</Text>
            </Button>
            <View className="flex-1">
              <ProposeProposalWriteButton
                cast={cast}
                channel={channel}
                proposal={proposal}
                tokenInfo={tokenInfo}
                paymentTokenInfo={paymentTokenInfo!}
                usedPaymentTokenInfo={selectedPaymentToken}
                paymentTokenInfoLoading={paymentTokenInfoLoading}
                paymentAmount={selectedPayAmount!}
                onProposeSuccess={onProposeSuccess}
                onProposeError={onProposeError}
                approveText="👍 Superlike (Approve)"
              />
            </View>
          </View>
        </>
      )}
    </>
  );
}

const displayValue = (value: number, maximumFractionDigits: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(Number(value));
};
export function PriceRangeRow({
  max,
  min,
  value,
  maximumFractionDigits = 2,
}: {
  max: number;
  min: number;
  value: number;
  maximumFractionDigits?: number;
}) {
  return (
    <View className="flex flex-row items-center justify-between">
      <Text className="text-xs font-normal text-primary-foreground">
        {displayValue(min, maximumFractionDigits)}(minimum)
      </Text>
      <Text className="text-xs font-normal text-primary-foreground">
        {displayValue(value, maximumFractionDigits)}
      </Text>
      <Text className="text-xs font-normal text-primary-foreground">
        {displayValue(max, maximumFractionDigits)}
      </Text>
    </View>
  );
}
