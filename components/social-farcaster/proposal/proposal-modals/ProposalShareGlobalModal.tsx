import PlatformSharingModal from "~/components/platform-sharing/PlatformSharingModal";
import { appModalsStateDefalut } from "~/features/appModalsSlice";
import useAppModals from "~/hooks/useAppModals";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import {
  getCastDetailWebsiteLink,
  getVoteProposalFrameLink,
} from "~/utils/platform-sharing/link";
import {
  getCastProposalShareTextWithTwitter,
  getCastProposalShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";

export default function ProposalShareGlobalModal() {
  const { proposalShareModal, upsertProposalShareModal } = useAppModals();
  const { cast, channel } = proposalShareModal;
  return (
    <PlatformSharingModal
      modalTitle="Share"
      open={proposalShareModal.open}
      onOpenChange={(open) => {
        upsertProposalShareModal({ open });
      }}
      warpcastText={getCastProposalShareTextWithWarpcast()}
      twitterText={getCastProposalShareTextWithTwitter()}
      websiteLink={getCastDetailWebsiteLink(getCastHex(cast!))}
      warpcastEmbeds={[getVoteProposalFrameLink(getCastHex(cast!))]}
      warpcastChannelId={channel?.channelId}
      hideWarpcastPoints
      hideTwitterPoints
      navigateToCreatePageAfter={() => {
        upsertProposalShareModal(appModalsStateDefalut.proposalShareModal);
      }}
    />
  );
}
