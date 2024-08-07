import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import Toast from "react-native-toast-message";
import { UpvoteProposalModalContentBody } from "./UpvoteProposalModal";
import { ChallengeProposalWriteForm } from "./ChallengeProposalModal";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

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
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
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
        <View className="flex flex-row justify-center">
          <Text>or</Text>
        </View>
        <ChallengeProposalWriteForm
          cast={cast}
          channel={channel}
          proposal={{ ...proposal, status: ProposalState.Accepted }}
          tokenInfo={tokenInfo}
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
          onProposeSuccess={() => {
            setOpen(false);
            Toast.show({
              type: "success",
              text1: "Submitted",
            });
          }}
          onProposeError={(error) => {
            setOpen(false);
            Toast.show({
              type: "error",
              // text1: "Challenges cannot be repeated this round",
              text1: error.message,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
