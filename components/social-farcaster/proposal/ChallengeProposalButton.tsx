import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import ChallengeProposalModal, {
  CastProposeStatusProps,
} from "./ChallengeProposalModal";
import { ButtonProps } from "~/components/ui/button";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";

export default function ChallengeProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { status, finalizeTime } = proposal;
  const resultText =
    status === ProposalState.Accepted
      ? `👎 ${Number(proposal?.downvoteCount) > 0 ? proposal.downvoteCount : ""}`
      : `👍${Number(proposal?.upvoteCount) > 0 ? proposal.upvoteCount : ""}`;
  if (!isConnected) {
    return (
      <ActionButton
        className="h-8  w-auto min-w-[60px] rounded-lg px-1"
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
