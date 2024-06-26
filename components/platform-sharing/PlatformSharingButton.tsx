import { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { cn } from "~/lib/utils";
import {
  getAppFrameLink,
  getAppWebsiteLink,
  getCommunityFrameLink,
  getCommunityWebsiteLink,
  getPortfolioFrameLink,
  getPortfolioWebsiteLink,
  getTradePageFrameLink,
  getTradePageWebsiteLink,
} from "~/utils/platform-sharing/link";
import {
  getAppShareTextWithTwitter,
  getAppShareTextWithWarpcast,
  getCommunityShareTextWithTwitter,
  getCommunityShareTextWithWarpcast,
  getPortfolioTextWithTwitter,
  getPortfolioTextWithWarpcast,
  getTransactionShareTextWithTwitter,
  getTransactionShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { Share2 } from "../common/Icons";
import { Button, ButtonProps } from "../ui/button";
import PlatformSharingModal, { ShareProps } from "./PlatformSharingModal";

export default function PlatformSharingButton({
  text,
  twitterText,
  warpcastText,
  websiteLink,
  warpcastEmbeds,
  warpcastChannelId,
  className,
  navigateToCreatePageAfter,
  ...props
}: ButtonProps & ShareProps) {
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
        warpcastEmbeds={warpcastEmbeds}
        warpcastChannelId={warpcastChannelId}
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
      warpcastEmbeds={[
        getAppFrameLink({
          fid,
        }),
      ]}
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
      warpcastEmbeds={[
        getTradePageFrameLink({
          fid,
        }),
      ]}
    />
  );
}

export function PortfolioSharingButton({
  fid,
  fname,
}: {
  fid: number;
  fname: string;
}) {
  const { currFid } = useFarcasterAccount();
  return (
    <PlatformSharingButton
      twitterText={getPortfolioTextWithTwitter()}
      warpcastText={getPortfolioTextWithWarpcast()}
      websiteLink={getPortfolioWebsiteLink({
        fid,
        inviteFid: Number(currFid),
      })}
      warpcastEmbeds={[
        getPortfolioFrameLink({
          fid,
          fname,
        }),
      ]}
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
      warpcastEmbeds={[
        getCommunityFrameLink(channelId, {
          fid: currFid,
        }),
      ]}
      warpcastChannelId={channelId}
    />
  );
}

type TransactionResultProps = {
  type: ONCHAIN_ACTION_TYPE;
  transactionDetailURL: string;
};

export function TransactionResultSharingButton({
  type,
  transactionDetailURL,
  text,
  twitterText,
  warpcastText,
  websiteLink,
  warpcastEmbeds,
  className,
  navigateToCreatePageAfter,
  ...props
}: ButtonProps & ShareProps & TransactionResultProps) {
  const [open, setOpen] = useState(false);
  const { currFid } = useFarcasterAccount();

  return (
    <View>
      <Button
        variant="outline"
        className="border-secondary bg-white"
        onPress={() => {
          setOpen(true);
        }}
        {...props}
      >
        <Text>Share & Earn $CAST</Text>
      </Button>
      <PlatformSharingModal
        open={open}
        onOpenChange={(open) => setOpen(open)}
        text={text}
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
        warpcastEmbeds={[
          getTradePageFrameLink({
            fid: currFid,
          }),
        ]}
        navigateToCreatePageAfter={navigateToCreatePageAfter}
      />
    </View>
  );
}
