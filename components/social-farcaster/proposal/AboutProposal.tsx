import { UnorderedList } from "~/components/common/UnorderedList";

export const getChallengeAboutInfo = () => {
  return [
    "Propose: Turn a cast into a Channel NFT.",
    "Challenge: Disagree? Challenge extends countdown by 1 hour. One challenge per account per phase.",
    "Approve: Approved proposal = Channel NFT.",
    "Weight: Challenge weight = √spent.",
    "Win: Stance must have 2x the weight to win.",
    "Result: Final stance after countdown.",
    "Funds: Winner gets principal back, loser’s funds go to the winner based on weight.",
    "Cost: Minimum challenge cost = NFT price.",
  ];
};

export function AboutProposalChallenge() {
  return <UnorderedList texts={getChallengeAboutInfo()} />;
}
