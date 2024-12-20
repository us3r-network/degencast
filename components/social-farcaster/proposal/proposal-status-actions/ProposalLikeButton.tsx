import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "../proposal-modals/CreateProposalModal";
import { ButtonProps } from "~/components/ui/button";
import { useAccount } from "wagmi";
import { formatUnits, TransactionReceipt } from "viem";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import { ProposalButton } from "../ui/proposal-button";
import { ProposalText } from "../ui/proposal-text";
import useUserAction from "~/hooks/user/useUserAction";
import { UserActionName } from "~/services/user/types";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import Toast from "react-native-toast-message";

export function ProposalLikeButton({
  cast,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const { submitUserAction, actionPointConfig } = useUserAction();

  const {
    requestSigner,
    hasSigner,
    requesting: signerRequesting,
  } = useFarcasterSigner();

  const { address } = useAccount();
  const { connectWallet } = useWalletAccount();

  const disabled = signerRequesting;
  const { upsertOneToProposals } = useCacheCastProposal();

  const castHash = cast.hash;
  return (
    <ProposalButton
      variant={"not-proposed"}
      disabled={disabled}
      onPress={() => {
        if (!hasSigner) {
          requestSigner();
          return;
        }
        if (!address) {
          connectWallet();
          return;
        }
        submitUserAction({
          action: UserActionName.VoteCast,
          castHash: castHash,
        });
        upsertOneToProposals(castHash as any, {
          status: ProposalState.Disputed,
        });
        Toast.show({
          type: "success",
          text1: `Like successfully! $CAST +${actionPointConfig.VoteCast.unit}!`,
        });
      }}
      {...props}
    >
      <ProposalText>Like for $CAST</ProposalText>
    </ProposalButton>
  );
}
