import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { ExploreCard } from "./ExploreStyled";
export function ConnectFarcasterCard() {
  const { authenticated, login, linkFarcaster } = usePrivy();
  const { currFid } = useFarcasterAccount();
  return (
    <ExploreCard className="flex-row items-center justify-center">
      <Button
        className="rounded-lg bg-primary"
        onPress={() => {
          if (!authenticated) {
            login();
            return;
          }
          if (!currFid) {
            linkFarcaster();
            return;
          }
        }}
      >
        <Text className="text-primary-foreground">
          {(() => {
            if (!authenticated) {
              return "Log in";
            }
            if (!currFid) {
              return "Link Farcaster";
            }
          })()}
        </Text>
      </Button>
    </ExploreCard>
  );
}
