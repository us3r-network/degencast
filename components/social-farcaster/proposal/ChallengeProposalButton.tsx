import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import ChallengeProposalModal, {
  CastProposeStatusProps,
} from "./ChallengeProposalModal";
import { ProposalResult } from "~/services/feeds/types/proposal";
import { ButtonProps } from "~/components/ui/button";

export default function ChallengeProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const { result, finalizeTime } = proposal;
  const resultText =
    result === ProposalResult.Upvote
      ? `👎 ${Number(proposal?.downvoteCount) > 0 ? proposal.downvoteCount : ""}`
      : `👍${Number(proposal?.upvoteCount) > 0 ? proposal.upvoteCount : ""}`;
  if (!account.address) {
    return (
      <ActionButton
        size={"icon"}
        className="h-8  rounded-lg"
        onPress={() => connectWallet()}
      >
        <Text className="text-sm">{resultText}</Text>
      </ActionButton>
    );
  }

  return (
    <ChallengeProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ActionButton size={"icon"} className="h-8  rounded-lg" {...props}>
          <Text className="text-sm">{resultText}</Text>
        </ActionButton>
      }
    />
  );
}
