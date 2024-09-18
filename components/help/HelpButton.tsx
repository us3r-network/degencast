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
import { Separator } from "../ui/separator";

export default function HelpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-0 p-0">
          <CircleHelp className="stroke-secondary" />
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
  "Upvote/Downvote: Create or reject a Curation NFT.",
  "Vote Cost & Weight: Costs the NFT price; weight depends on spending.",
  "Challenge: Extend countdown; need double the weight to win.",
  "Curators: Top 10 early upvoters earn more.",
];

export const CurationNFTInfo = [
  "Token Value: Each NFT equals 100,000 Curation Tokens.",
  "Fees Distribution: 1% to Degencast, 2% to host, 3% to creators, 4% to curators.",
  "Bonding Curve: Shared curve; liquidity moves to Uniswap at 42069 DEGEN cap.",
  "After Launch: NFT still equals 100,000 Tokens.",
];

export function AboutContents() {
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex gap-4">
        <Text className="text-base font-bold">Curate</Text>
        <UnorderedList texts={CurationInfo} />
        <Text className="text-base">Curation NFT</Text>
        <UnorderedList texts={CurationNFTInfo} />
      </View>
    </ScrollView>
  );
}
