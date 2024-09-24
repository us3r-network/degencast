import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import ChallengeProposalModal, {
  CastProposeStatusProps,
} from "../proposal-modals/ChallengeProposalModal";
import { ProposalButtonBody } from "./ProposalButtonBody";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { View } from "react-native";
import { Deadline, LikeCount } from "../ProposalStyled";
import useAuth from "~/hooks/user/useAuth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";

export function ChallengeProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ProposalButtonProps & CastProposeStatusProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { ready, authenticated, login } = useAuth();

  if (!proposal) return null;
  const { status } = proposal;
  const buttonVariant =
    status === ProposalState.Disputed ? "disputed" : "accepted";
  const buttonBody = (
    <ProposalButtonBody
      cast={cast}
      channel={channel}
      proposal={proposal!}
      tokenInfo={tokenInfo}
    />
  );

  if (!authenticated) {
    return (
      <ProposalButton
        variant={buttonVariant}
        onPress={() => {
          if (ready) {
            login();
          }
        }}
      >
        {buttonBody}
      </ProposalButton>
    );
  }

  if (!address || !isConnected) {
    return (
      <ProposalButton variant={buttonVariant} onPress={() => connectWallet()}>
        {buttonBody}
      </ProposalButton>
    );
  }

  return (
    <ChallengeProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ProposalButton variant={buttonVariant} {...props}>
          {buttonBody}
        </ProposalButton>
      }
    />
  );
}

export function ChallengeProposalActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastProposeStatusProps) {
  const { likeCount } = useFarcasterLikeAction({ cast });
  return (
    <View className="flex flex-row items-center gap-4">
      {proposal?.finalizeTime && (
        <Deadline timestamp={proposal?.finalizeTime} />
      )}
      <LikeCount count={likeCount || 0} />
      <ChallengeProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
