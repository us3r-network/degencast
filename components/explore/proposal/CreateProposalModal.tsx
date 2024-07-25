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
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalCastCard from "./ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import { TransactionReceipt } from "viem";
import ProposeWriteButton from "./CreateProposalWriteButton";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import Toast from "react-native-toast-message";
import PriceRow from "./PriceRow";

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
  proposal?: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

export default function CreateProposalModal({
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
        <CreateProposalModalContentBody
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
          onCreateProposalSuccess={() => {
            Toast.show({
              type: "success",
              text1: "Proposal created",
            });
            setOpen(false);
          }}
          onCreateProposalError={(error) => {
            Toast.show({
              type: "error",
              text1: "Proposal already exists",
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateProposalModalContentBody({
  cast,
  channel,
  proposal,
  tokenInfo,
  onCreateProposalSuccess,
  onCreateProposalError,
}: CastProposeStatusProps & {
  onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
  onCreateProposalError?: (error: any) => void;
}) {
  const { price, isLoading } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  return (
    <>
      <DialogHeader
        className={cn("mr-4 flex-row items-center justify-between gap-2")}
      >
        <DialogTitle>Propose</DialogTitle>
      </DialogHeader>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      <PriceRow
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
      />
      <ProposeWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        onCreateProposalSuccess={onCreateProposalSuccess}
        onCreateProposalError={onCreateProposalError}
        text={!price ? "Proposal already exists" : ""}
      />

      <DialogFooter>
        <About
          title="About Proposal, upvote & channel NFT"
          info={getAboutInfo()}
        />
      </DialogFooter>
    </>
  );
}
