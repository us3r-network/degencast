import { ScrollView } from "react-native";
import { UnorderedList } from "~/components/common/UnorderedList";

export const getChallengeAboutInfo = () => {
  return [
    "Propose: Turn a cast into a Channel NFT.",
    "Approve: Approved proposal = Channel NFT.",
    "Cost: Minimum challenge cost = NFT price.",
    "Weight: Challenge weight = √spent.",
    "Challenge: Disagree? Challenge extends countdown by 1 hour. One challenge per account per phase.",
    "Win: Stance must have 2x the weight to win.",
    "Result: Final stance after countdown.",
    "Funds: Winner gets principal back, loser’s funds go to the winner based on weight.",
    "Channel NFT = 1000 Channel Token.",
    "Curators: After proposal is approved, top 10 upvoters(include proposer) = curators. The earlier the more revenue.",
    "NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, ,Curators 4%.",
    "All Channel NFTs share a same channel bonding curve.",
    "When channel bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
    "After token launch, Channel NFT = 1000 Channel Token.",
  ];
};

export function AboutProposalChallenge() {
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <UnorderedList texts={getChallengeAboutInfo()} />
    </ScrollView>
  );
}
