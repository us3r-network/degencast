import { cn } from "~/lib/utils";
import { Share2 } from "../common/Icons";
import { Button, ButtonProps } from "../ui/button";
import PlatformSharingModal from "./PlatformSharingModal";
import { useState } from "react";
import {
  getAppShareTextWithTwitter,
  getAppShareTextWithWarpcast,
  getCommunityShareTextWithTwitter,
  getCommunityShareTextWithWarpcast,
  getTransactionShareTextWithTwitter,
  getTransactionShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import {
  getAppFrameLink,
  getAppWebsiteLink,
  getCommunityFrameLink,
  getCommunityWebsiteLink,
  getTradePageFrameLink,
  getTradePageWebsiteLink,
} from "~/utils/platform-sharing/link";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { TransactionReceipt } from "viem";
import { View } from "react-native";

export default function PlatformSharingButton({
  text,
  twitterText,
  warpcastText,
  websiteLink,
  frameLink,
  className,
  navigateToCreatePageAfter,
  ...props
}: ButtonProps & {
  text?: string;
  twitterText?: string;
  warpcastText?: string;
  websiteLink: string;
  frameLink: string;
  navigateToCreatePageAfter?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button
        className={cn("bg-transparent p-0", className)}
        onPress={() => {
          setOpen(true);
        }}
        {...props}
      >
        <Share2
          className={cn(
            " size-5 fill-primary-foreground stroke-primary-foreground",
          )}
        />
      </Button>
      <PlatformSharingModal
        open={open}
        onOpenChange={(open) => setOpen(open)}
        text={text}
        twitterText={twitterText}
        warpcastText={warpcastText}
        websiteLink={websiteLink}
        frameLink={frameLink}
        navigateToCreatePageAfter={navigateToCreatePageAfter}
      />
    </View>
  );
}

export function ExploreSharingButton({ fid }: { fid: string | number }) {
  return (
    <PlatformSharingButton
      twitterText={getAppShareTextWithTwitter()}
      warpcastText={getAppShareTextWithWarpcast()}
      websiteLink={getAppWebsiteLink({
        fid,
      })}
      frameLink={getAppFrameLink({
        fid,
      })}
    />
  );
}

export function TradeSharingButton({ fid }: { fid: string | number }) {
  return (
    <PlatformSharingButton
      twitterText={getAppShareTextWithTwitter()}
      warpcastText={getAppShareTextWithWarpcast()}
      websiteLink={getTradePageWebsiteLink({
        fid,
      })}
      frameLink={getTradePageFrameLink({
        fid,
      })}
    />
  );
}

export function TransactionResultSharingButton({
  type,
  transactionDetailURL,
  navigateToCreatePageAfter,
}: {
  type: ONCHAIN_ACTION_TYPE;
  transactionDetailURL: string;
  navigateToCreatePageAfter?: () => void;
}) {
  const { currFid } = useFarcasterAccount();
  return (
    <PlatformSharingButton
      variant="secondary"
      className="bg-secondary p-2"
      twitterText={getTransactionShareTextWithTwitter(
        type,
        transactionDetailURL,
      )}
      warpcastText={getTransactionShareTextWithWarpcast(
        type,
        transactionDetailURL,
      )}
      websiteLink={getTradePageWebsiteLink({
        fid: currFid,
      })}
      frameLink={getTradePageFrameLink({
        fid: currFid,
      })}
      navigateToCreatePageAfter={navigateToCreatePageAfter}
    />
  );
}

export function CommunitySharingButton({
  name,
  channelId,
  currFid,
}: {
  name: string;
  channelId: string;
  currFid: string | number;
}) {
  return (
    <PlatformSharingButton
      twitterText={getCommunityShareTextWithTwitter(name || "")}
      warpcastText={getCommunityShareTextWithWarpcast(name || "")}
      websiteLink={getCommunityWebsiteLink(channelId, {
        fid: currFid,
      })}
      frameLink={getCommunityFrameLink(channelId, {
        fid: currFid,
      })}
    />
  );
}
