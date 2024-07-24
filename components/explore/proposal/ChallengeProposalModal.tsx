import { useEffect, useState } from "react";
import { View } from "react-native";
import About from "~/components/common/About";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import {
  ProposalEntity,
  ProposalResult,
} from "~/services/feeds/types/proposal";
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

const getAboutInfo = () => {
  return [
    "Propose: Turn a cast into a Channel NFT.",
    "Challenge: Disagree? Challenge extends countdown by 1 hour. One challenge per account per phase.",
    "Approve: Approved proposal = Channel NFT.",
    "Weight: Challenge weight = √spent.",
    "Win: Stance must have 2x the weight to win.",
    "Result: Final stance after countdown.",
    "Funds: Winner gets principal back, loser’s funds go to the winner based on weight.",
    "Cost: Minimum challenge cost = NFT price.",
  ];
};

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
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
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader
          className={cn("mr-4 flex-row items-center justify-between gap-2")}
        >
          <DialogTitle>Challenge</DialogTitle>
        </DialogHeader>
        <View className="flex-row items-center justify-between gap-2">
          <Text>Active Wallet</Text>
          <UserWalletSelect />
        </View>
        <View className="flex-row items-center justify-between gap-2">
          <Text>The current stance on the proposal is:</Text>
          <Text className="text-sm">
            {proposal.result === ProposalResult.Downvote ? "👎" : "👍"}
          </Text>
        </View>

        <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />

        {proposal.result === ProposalResult.Upvote ? (
          <DisputeProposalWrite
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={tokenInfo}
            onDisputeSuccess={() => {
              setOpen(false);
              Toast.show({
                type: "success",
                text1: "Submitted",
              });
            }}
            onDisputeError={() => {
              setOpen(false);
              Toast.show({
                type: "error",
                text1: "Challenges cannot be repeated this round",
              });
            }}
          />
        ) : (
          <ProposeProposalWrite
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={tokenInfo}
            onProposeSuccess={() => {
              setOpen(false);
              Toast.show({
                type: "success",
                text1: "Submitted",
              });
            }}
            onProposeError={() => {
              setOpen(false);
              Toast.show({
                type: "error",
                text1: "Challenges cannot be repeated this round",
              });
            }}
          />
        )}

        <DialogFooter>
          <About title="About Proposal & channel NFT" info={getAboutInfo()} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DisputeProposalWrite({
  cast,
  channel,
  proposal,
  tokenInfo,
  onDisputeSuccess,
  onDisputeError,
}: CastProposeStatusProps & {
  onDisputeSuccess?: (proposal: TransactionReceipt) => void;
  onDisputeError?: (error: any) => void;
}) {
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const { price, isLoading } = useDisputePrice({
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
      />
      <Slider
        {...priceSliderConfig}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const decimalsStr = "0".repeat(paymentTokenInfo?.decimals!);
            const vInt = Math.round(Number(v));
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

function ProposeProposalWrite({
  cast,
  channel,
  proposal,
  tokenInfo,
  onProposeSuccess,
  onProposeError,
}: CastProposeStatusProps & {
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
}) {
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const { price, isLoading } = useProposePrice({
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
      />
      <Slider
        {...priceSliderConfig}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const decimalsStr = "0".repeat(paymentTokenInfo?.decimals!);
            const vInt = Math.round(Number(v));
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
