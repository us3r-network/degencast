import { useState } from "react";
import { View } from "react-native";
import About from "~/components/common/About";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposeCastCard from "./ProposeCastCard";
import { Button } from "~/components/ui/button";
import { Image } from "react-native";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import { formatUnits } from "viem";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";

const getAboutInfo = () => {
  return [
    "Propose: Turn a cast into a Channel NFT.",
    "Approve: Approved proposal = Channel NFT.",
    "Curator: After proposal is approved, proposer = curator.",
    "NFT transaction fee: Degencast 1%, Curator 2%, Creator 3%, Channel host 4%.",
    "Channel NFT = Channel share.",
    "All Channel NFTs share a same channel bonding curve.",
    "When channel bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
    "Channel NFT holders could claim airdrops after channel token launch.",
  ];
};

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

export default function ProposeModal({
  cast,
  channel,
  proposal,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const aboutInfo = getAboutInfo();
  const { price, isLoading } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader
          className={cn("mr-4 flex-row items-center justify-between gap-2")}
        >
          <DialogTitle>Propose</DialogTitle>
        </DialogHeader>
        <View className="flex-row items-center justify-between gap-2">
          <Text>Active Wallet</Text>
          <UserWalletSelect />
        </View>
        <ProposeCastCard
          channel={channel}
          cast={cast}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
        <View className="flex flex-row items-center justify-between">
          <Text>Total Coast.</Text>
          <View className="flex flex-row items-center gap-1">
            <Image
              source={require("~/assets/images/degen-icon-2.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
            <Text className="font-normal">
              {isLoading || !price ? "--" : formatUnits(price, 18)} DEGEN
            </Text>
          </View>
        </View>
        <OnChainActionButtonWarper
          variant="secondary"
          className="w-full"
          targetChainId={ATT_CONTRACT_CHAIN.id}
          warpedButton={
            <Button
              variant={"secondary"}
              className="w-full rounded-md"
              onPress={() => {
                alert("TODO");
              }}
            >
              <Text>Propose</Text>
            </Button>
          }
        />

        <DialogFooter>
          <About title="About Proposal & channel NFT" info={aboutInfo} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
