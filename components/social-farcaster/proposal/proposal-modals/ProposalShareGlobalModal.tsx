import { useMemo } from "react";
import PlatformSharingModal from "~/components/platform-sharing/PlatformSharingModal";
import { appModalsStateDefalut } from "~/features/appModalsSlice";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useAppModals from "~/hooks/useAppModals";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import {
  getCastDetailWebsiteLink,
  getCastDetailFrameLink,
  getMintNFTFrameLink,
  getMintNFTWebsiteLink,
} from "~/utils/platform-sharing/link";
import {
  getCastProposalShareTextWithTwitter,
  getCastProposalShareTextWithWarpcast,
  getTransactionShareTextWithTwitter,
  getTransactionShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";

export default function ProposalShareGlobalModal() {
  const { currFid } = useFarcasterAccount();
  const { proposalShareModal, upsertProposalShareModal } = useAppModals();
  const { cast, channel, proposal, description } = proposalShareModal;
  const castHash = getCastHex(cast!);
  const config = useMemo(() => {
    if (proposal && proposal.status === ProposalState.ReadyToMint) {
      return {
        warpcastText: getTransactionShareTextWithWarpcast(
          ONCHAIN_ACTION_TYPE.MINT_NFT,
        ),
        twitterText: getTransactionShareTextWithTwitter(
          ONCHAIN_ACTION_TYPE.MINT_NFT,
        ),
        websiteLink: getMintNFTWebsiteLink({
          fid: currFid,
          castHash,
        }),
        warpcastEmbeds: [
          getMintNFTFrameLink({
            fid: currFid,
            castHash,
          }),
        ],
      };
    }
    return {
      warpcastText: getCastProposalShareTextWithWarpcast(),
      twitterText: getCastProposalShareTextWithTwitter(),
      websiteLink: getCastDetailWebsiteLink(castHash),
      warpcastEmbeds: [getCastDetailFrameLink(castHash)],
    };
  }, [castHash, proposal, currFid]);
  return (
    <PlatformSharingModal
      modalTitle="Share"
      modalDescription={description}
      open={proposalShareModal.open}
      onOpenChange={(open) => {
        upsertProposalShareModal({ open });
      }}
      warpcastChannelId={channel?.channelId}
      hideWarpcastPoints
      hideTwitterPoints
      navigateToCreatePageAfter={() => {
        upsertProposalShareModal(appModalsStateDefalut.proposalShareModal);
      }}
      {...config}
    />
  );
}
