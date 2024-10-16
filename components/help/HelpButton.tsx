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
import { SECONDARY_COLOR } from "~/constants";

export default function HelpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-0 native:p-0">
          <CircleHelp
            color={SECONDARY_COLOR}
          />
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
  "Superlike/Dislike: Create or reject a Contribution NFT.",
  "Stake & Weight: Stake the NFT price; weight depends on spending.",
  "Challenge: Extend countdown; need double the weight to win.",
  "Contributors: Top 10 early contributors earn more.",
];

export const CurationNFTInfo = [
  "Token Value: Each cast equals 100,000 Channel Tokens",
  "Fees Distribution: 1% to Degencast, 4% to host, 5% to creator.",
  "Bonding Curve: Shared curve, liquidity moves to Uniswap at 42069 DEGEN cap.",
  "After Launch: NFT still equals 100,000 Channel Tokens.",
];

export function AboutContents() {
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex gap-4">
        {/* <Text className="text-base font-bold">Superlike</Text>
        <UnorderedList texts={CurationInfo} /> */}
        {/* <Text className="text-base">Contribution NFT</Text> */}
        <UnorderedList texts={CurationNFTInfo} />
      </View>
    </ScrollView>
  );
}
