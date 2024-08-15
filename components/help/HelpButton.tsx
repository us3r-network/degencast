import { ScrollView, View } from "react-native";
import { CircleHelp } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { UnorderedList } from "../common/UnorderedList";
import { Separator } from "../primitives/dropdown-menu";

export default function HelpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  className="p-0 m-0">
          <CircleHelp color="white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader className={cn("flex gap-4")}>
          <DialogTitle>How it works</DialogTitle>
          <Separator className="h-[1px] bg-white" />
        </DialogHeader>
        <AboutContents />
      </DialogContent>
    </Dialog>
  );
}

export const CurationInfo = [
  "Upvote: Turn a cast into a Curation NFT.",
  "Downvote: Reject the curation decision.",
  "Vote cost: Minimum cost = NFT price.",
  "Weight: Vote weight = √spent.",
  "Challenge: Disagree with current stance. Challenge extends countdown by 1 hour. One challenge per account per phase.",
  "Win: Stance must have 2x the weight to win.",
  "Result: Final stance after countdown.",
  "Funds: Winner gets principal back, loser’s funds go to the winner based on weight.",
  "Curators: After curation is approved, top 10 upvoters = curators. The earlier the more revenue.",
];

export const CurationNFTInfo = [
  "Curation NFT = 1000 Curation Token.",
  "NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, ,Curators 4%.",
  "All Curation NFTs share a same bonding curve.",
  "When bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
  "After token launch, Curation NFT = 1000 Curation Token.",
];

export function AboutContents() {
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex gap-4">
        <Text className="text-base font-bold">Curation</Text>
        <UnorderedList texts={CurationInfo} />
        <Text className="text-base">Curation NFT</Text>
        <UnorderedList texts={CurationNFTInfo} />
      </View>
    </ScrollView>
  );
}
