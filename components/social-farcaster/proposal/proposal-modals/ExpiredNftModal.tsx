import { createContext, useContext, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { TokenActivitieList } from "~/components/activity/Activities";
import { AboutContents } from "~/components/help/HelpButton";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { NftDetails } from "~/components/onchain-actions/att/ATTShared";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import useCurationTokenInfo from "~/hooks/user/useCurationTokenInfo";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalCastCard from "../ProposalCastCard";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const ExpiredNftModalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useExpiredNftModalCtx = () => {
  const ctx = useContext(ExpiredNftModalCtx);
  if (!ctx) {
    throw new Error("useExpiredNftModalCtx must be used within a provider");
  }
  return ctx;
};
export function ExpiredNftModal({
  cast,
  channel,
  proposal,
  tokenInfo,
  open,
  setOpen,
}: CastProposeStatusProps & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <ExpiredNftModalCtx.Provider
          value={{
            cast,
            channel,
            proposal,
            tokenInfo,
            setOpen,
          }}
        >
          <ExpiredNftModalContent />
        </ExpiredNftModalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function ExpiredNftModalContent() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "challenge", title: "Nft" },
    { key: "details", title: "Details" },
    { key: "activity", title: "Activity" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    challenge: ExpiredNftModalContentBodyScene,
    details: DetailsScene,
    activity: ActivitiesListScene,
    about: AboutContents,
  });
  return (
    <TabView
      lazy
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={DialogTabBar}
    />
  );
}

function ExpiredNftModalContentBodyScene() {
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useExpiredNftModalCtx();
  return (
    <ScrollView
      className="max-h-[80vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <ExpiredNftModalContentBody
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        onClose={() => {
          setOpen(false);
        }}
      />
    </ScrollView>
  );
}

export const DetailsScene = () => {
  const { tokenInfo, proposal } = useExpiredNftModalCtx();
  const token = {
    contractAddress: tokenInfo!.tokenContract,
    tokenId: Number(proposal.tokenId),
  };
  const { tokenInfo: nftInfo } = useCurationTokenInfo(
    token.contractAddress,
    token.tokenId,
  );
  if (!proposal.tokenId) {
    return null;
  }
  // console.log("DetailsScene", token, cast);
  return <NftDetails token={token} tokenInfo={nftInfo} />;
};
function ActivitiesListScene() {
  const { tokenInfo, proposal } = useExpiredNftModalCtx();
  const token = {
    contractAddress: tokenInfo!.tokenContract,
    tokenId: Number(proposal.tokenId),
  };
  if (!proposal.tokenId) {
    return null;
  }
  return (
    <View className="h-[500px] w-full">
      <TokenActivitieList token={token} />
    </View>
  );
}
function ExpiredNftModalContentBody({
  cast,
  channel,
  proposal,
  tokenInfo,
  onClose,
}: CastProposeStatusProps & {
  onClose: () => void;
}) {
  return (
    <View className="flex w-full flex-col gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text>Cast Status:</Text>
        <Text className="text-sm">Eliminated</Text>
      </View>
      {/* <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} /> */}
    </View>
  );
}

export function ExpiredNftButton({
  className,
  renderButton,
  ...props
}: CastProposeStatusProps & {
  className?: string;
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const handlePress = () => {
    setOpen(true);
  };
  return (
    <Pressable className={cn("w-14", className)}>
      {renderButton ? (
        renderButton({ onPress: handlePress })
      ) : (
        <Button
          className={cn("w-full")}
          size="sm"
          variant={"secondary"}
          onPress={handlePress}
        >
          <Text>End</Text>
        </Button>
      )}

      <ExpiredNftModal open={open} setOpen={setOpen} {...props} />
    </Pressable>
  );
}
