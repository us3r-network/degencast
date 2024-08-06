import { useState } from "react";
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
import ProposalCastCard from "./ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { ProposeProposalWriteButton } from "./ProposalWriteButton";
import PriceRow from "./PriceRow";
import { TransactionReceipt } from "viem";
import Toast from "react-native-toast-message";

export const getAboutInfo = () => {
  return [
    "Propose: Turn a cast into a Channel NFT.",
    "Approve: Approved proposal = Channel NFT.",
    "Curators: After proposal is approved, top 10 upvoters(include proposer) = curators. The earlier the more revenue.",
    "NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, ,Curators 4%.",
    "Channel NFT = Channel share.",
    "All Channel NFTs share a same channel bonding curve.",
    "When channel bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
    "After token launch, Channel NFT = 1000 Channel Token.",
  ];
};

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
};

export default function UpvoteProposalModal({
  cast,
  channel,
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
        <UpvoteProposalModalContentBody
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
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
      </DialogContent>
    </Dialog>
  );
}

export function UpvoteProposalModalContentBody({
  cast,
  channel,
  tokenInfo,
  onProposeSuccess,
  onProposeError,
}: CastProposeStatusProps & {
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
}) {
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
  return (
    <>
      <DialogHeader
        className={cn("mr-4 flex-row items-center justify-between gap-2")}
      >
        <DialogTitle>Upvote</DialogTitle>
      </DialogHeader>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      <PriceRow
        title="Upvote Coast"
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
      />
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        tokenInfo={tokenInfo}
        price={price!}
        onProposeSuccess={onProposeSuccess}
        onProposeError={onProposeError}
      />
    </>
  );
}
