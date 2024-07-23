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
import { Image } from "react-native";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import { formatUnits } from "viem";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import {
  ProposeProposalWriteButton,
  DisputeProposalWriteButton,
} from "./ChallengeProposalWriteButton";
import useDisputePrice from "~/hooks/social-farcaster/proposal/useDisputePrice";

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

        <ProposalCastCard
          channel={channel}
          cast={cast}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />

        {proposal.result === ProposalResult.Upvote ? (
          <DisputeProposalWrite
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={tokenInfo}
          />
        ) : (
          <ProposeProposalWrite
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={tokenInfo}
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
}: CastProposeStatusProps) {
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
  return (
    <>
      <View className="flex flex-row items-center justify-between">
        <Text>Successfully challenge:</Text>
        <View className="flex flex-row items-center gap-1">
          <Image
            source={require("~/assets/images/degen-icon-2.png")}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
          <Text className="font-normal">
            {isLoading || !price
              ? "--"
              : formatUnits(price, paymentTokenInfo?.decimals || 18)}{" "}
            {paymentTokenInfo?.symbol}
          </Text>
        </View>
      </View>
      <DisputeProposalWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        price={selectPrice!}
      />
    </>
  );
}

function ProposeProposalWrite({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastProposeStatusProps) {
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
      console.log("price", price);
      setSelectPrice(price);
    }
  }, [price, isLoading]);
  return (
    <>
      <View className="flex flex-row items-center justify-between">
        <Text>The cost for a successful challenge:</Text>
        <View className="flex flex-row items-center gap-1">
          <Image
            source={require("~/assets/images/degen-icon-2.png")}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
          <Text className="font-normal">
            {isLoading || !price
              ? "--"
              : formatUnits(price, paymentTokenInfo?.decimals || 18)}{" "}
            {paymentTokenInfo?.symbol}
          </Text>
        </View>
      </View>
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        price={selectPrice!}
      />
    </>
  );
}
