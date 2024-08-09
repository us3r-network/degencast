import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import Toast from "react-native-toast-message";
import { UpvoteProposalModalContentBody } from "./UpvoteProposalModal";
import { ChallengeProposalWriteForm } from "./ChallengeProposalModal";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { SceneMap, TabView } from "react-native-tab-view";
import { AboutProposalChallenge } from "./AboutProposal";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const ProposedProposalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useProposedProposalCtx = () => {
  const ctx = useContext(ProposedProposalCtx);
  if (!ctx) {
    throw new Error("useProposedProposalCtx must be used within a provider");
  }
  return ctx;
};
export default function ProposedProposalModal({
  cast,
  channel,
  proposal,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upvote", title: "Upvote" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    upvote: ProposedProposalModalContentBodyScene,
    about: AboutProposalChallenge,
  });
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <ProposedProposalCtx.Provider
          value={{
            cast,
            channel,
            proposal,
            tokenInfo,
            setOpen,
          }}
        >
          <TabView
            swipeEnabled={false}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={DialogTabBar}
          />
        </ProposedProposalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function ProposedProposalModalContentBodyScene() {
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useProposedProposalCtx();
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex w-full flex-col gap-4">
        {" "}
        <UpvoteProposalModalContentBody
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
          onProposeSuccess={() => {
            Toast.show({
              type: "success",
              text1: "Voting speeds up success",
            });
            setOpen(false);
          }}
          onProposeError={(error) => {
            Toast.show({
              type: "error",
              text1: error.message,
            });
            setOpen(false);
          }}
        />
        <View className="flex flex-row justify-center">
          <Text>or</Text>
        </View>
        <ChallengeProposalWriteForm
          cast={cast}
          channel={channel}
          proposal={{ ...proposal, status: ProposalState.Accepted }}
          tokenInfo={tokenInfo}
          onDisputeSuccess={() => {
            setOpen(false);
            Toast.show({
              type: "success",
              text1: "Submitted",
            });
          }}
          onDisputeError={(error) => {
            setOpen(false);
            Toast.show({
              type: "error",
              // text1: "Challenges cannot be repeated this round",
              text1: error.message,
            });
          }}
          onProposeSuccess={() => {
            setOpen(false);
            Toast.show({
              type: "success",
              text1: "Submitted",
            });
          }}
          onProposeError={(error) => {
            setOpen(false);
            Toast.show({
              type: "error",
              // text1: "Challenges cannot be repeated this round",
              text1: error.message,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}
