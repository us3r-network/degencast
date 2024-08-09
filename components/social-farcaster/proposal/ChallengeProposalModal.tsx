import { createContext, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalCastCard from "./ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import {
  ProposeProposalWriteButton,
  DisputeProposalWriteButton,
} from "./ProposalWriteButton";
import useDisputePrice from "~/hooks/social-farcaster/proposal/useDisputePrice";
import PriceRow from "./PriceRow";
import Toast from "react-native-toast-message";
import { formatUnits, TransactionReceipt } from "viem";
import { Slider } from "~/components/ui/slider";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { DialogCastActivitiesList } from "~/components/activity/Activities";
import { SceneMap, TabView } from "react-native-tab-view";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { AboutProposalChallenge } from "./AboutProposal";

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
    { key: "details", title: "Details" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    challenge: ChallengeProposalContentBodyScene,
    details: CastActivitiesListScene,
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
      className="w-full max-sm:max-h-[80vh]"
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
    castHash: cast.hash,
  });
  const {
    price,
    isLoading,
    error: priceError,
  } = useDisputePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const [selectPrice, setSelectPrice] = useState<bigint | undefined>(undefined);
  useEffect(() => {
    if (!isLoading && price) {
      console.log("price", price);
      setSelectPrice(price);
    }
  }, [price, isLoading]);

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
  return (
    <>
      <PriceRow
        title={"The cost for a successful challenge:"}
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
        onClickPriceValue={() => {
          if (price) {
            setSelectPrice(price);
          }
        }}
      />
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
      <DisputeProposalWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        price={selectPrice!}
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
    castHash: cast.hash,
  });
  const {
    price,
    isLoading,
    error: priceError,
  } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const [selectPrice, setSelectPrice] = useState<bigint | undefined>(undefined);
  useEffect(() => {
    if (!isLoading && price) {
      setSelectPrice(price);
    }
  }, [price, isLoading]);

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
  return (
    <>
      <PriceRow
        title={"The cost for a successful challenge:"}
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
        onClickPriceValue={() => {
          if (price) {
            setSelectPrice(price);
          }
        }}
      />
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
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        price={selectPrice!}
        onProposeSuccess={onProposeSuccess}
        onProposeError={onProposeError}
      />
    </>
  );
}

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {}).format(Number(value));
};
export function PriceRangeRow({
  max,
  min,
  value,
}: {
  max: number;
  min: number;
  value: number;
}) {
  return (
    <View className="flex flex-row items-center justify-between">
      <Text className="text-xs font-normal">{displayValue(min)}</Text>
      <Text className="text-xs font-normal">{displayValue(value)}</Text>
      <Text className="text-xs font-normal">{displayValue(max)}</Text>
    </View>
  );
}
