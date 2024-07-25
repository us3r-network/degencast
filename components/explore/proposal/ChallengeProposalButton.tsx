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
  if (!account.address) {
    return (
      <ActionButton
        size={"icon"}
        className="rounded-full"
        onPress={() => connectWallet()}
      >
        <Text className="text-sm">
          {result === ProposalResult.Upvote ? "👎" : "👍"}
        </Text>
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
        <ActionButton size={"icon"} className="rounded-full" {...props}>
          <Text className="text-sm">
            {result === ProposalResult.Upvote ? "👎" : "👍"}
          </Text>
        </ActionButton>
      }
    />
  );
}
