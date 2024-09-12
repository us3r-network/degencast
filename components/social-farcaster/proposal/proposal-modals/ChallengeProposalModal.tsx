import { createContext, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
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
import { AboutProposalChallenge } from "./AboutProposal";
import useAppModals from "~/hooks/useAppModals";
import { Loading } from "~/components/common/Loading";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";

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
    { key: "challenge", title: "Challenge" },
    { key: "activity", title: "Activity" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    challenge: ChallengeProposalContentBodyScene,
    activity: CastActivitiesListScene,
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
  return (
    <View className="flex w-full flex-col gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>The current stance on the proposal is:</Text>
        <Text className="text-sm">
          {proposal.status === ProposalState.Disputed ? "👎" : "👍"}
        </Text>
      </View>

      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />

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
          onClose();
          Toast.show({
            type: "error",
            // text1: "Challenges cannot be repeated this round",
            text1: error.message,
          });
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
          onClose();
          Toast.show({
            type: "error",
            // text1: "Challenges cannot be repeated this round",
            text1: error.message,
          });
        }}
      />
    </View>
  );
}

export type DisputeProposalWrite = CastProposeStatusProps & {
  onDisputeSuccess?: (proposal: TransactionReceipt) => void;
  onDisputeError?: (error: any) => void;
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
};
export function ChallengeProposalWriteForm(
  props: CastProposeStatusProps & {
    onDisputeSuccess?: (proposal: TransactionReceipt) => void;
    onDisputeError?: (error: any) => void;
    onProposeSuccess?: (proposal: TransactionReceipt) => void;
    onProposeError?: (error: any) => void;
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
}: DisputeProposalWrite) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
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

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      console.log("price", price);
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  useEffect(() => {
    if (!priceLoading && price) {
      console.log("price", price);
      setSelectedPayAmount(price);
    }
  }, [price, priceLoading]);

  const minPayAmountNumber = tokenInfo?.bondingCurve?.basePrice || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );
  return (
    <>
      {paymentTokenInfoLoading ? (
        <Loading />
      ) : selectedPaymentToken ? (
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
      ) : null}
      <Text className="text-center text-xs text-secondary">
        Downvote spam casts, if you win, you can share the staked funds from
        upvoters.
      </Text>
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
      />
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
}: DisputeProposalWrite) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
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
  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      console.log("price", price);
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  useEffect(() => {
    if (!priceLoading && price) {
      console.log("price", price);
      setSelectedPayAmount(price);
    }
  }, [price, priceLoading]);

  const minPayAmountNumber = tokenInfo?.bondingCurve?.basePrice || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );
  return (
    <>
      {paymentTokenInfoLoading ? (
        <Loading />
      ) : selectedPaymentToken ? (
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
      ) : null}
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
      />
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
      <Text className="text-xs font-normal">
        {displayValue(min, maximumFractionDigits)}(minimum)
      </Text>
      <Text className="text-xs font-normal">
        {displayValue(value, maximumFractionDigits)}
      </Text>
      <Text className="text-xs font-normal">
        {displayValue(max, maximumFractionDigits)}
      </Text>
    </View>
  );
}
