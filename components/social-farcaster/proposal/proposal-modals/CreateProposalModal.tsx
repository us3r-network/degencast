import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import Toast from "react-native-toast-message";
import { formatUnits, parseUnits, TransactionReceipt } from "viem";
import { PercentPrograssText } from "~/components/common/PercentPrograssText";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { CreateTokenButton } from "~/components/trade/ATTCreateButton";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import useCacheCastAttToken from "~/hooks/social-farcaster/proposal/useCacheCastAttToken";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposeWriteButton from "../proposal-write-buttons/CreateProposalWriteButton";
import ProposalCastCard from "../ProposalCastCard";
import { getProposalMinPrice } from "../utils";
import { AboutProposalChallenge } from "./AboutProposal";
import { PriceRangeRow } from "./ChallengeProposalModal";
import PriceRow from "./PriceRow";
import useAppModals from "~/hooks/useAppModals";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";
import { Loading } from "~/components/common/Loading";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal?: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const CreateProposalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useCreateProposalCtx = () => {
  const ctx = useContext(CreateProposalCtx);
  if (!ctx) {
    throw new Error("useCreateProposalCtx must be used within a provider");
  }
  return ctx;
};

export default function CreateProposalModal({
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
    { key: "vote", title: "Vote" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    vote: CreateProposalModalContentBodyScene,
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
        <CreateProposalCtx.Provider
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
        </CreateProposalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function CreateProposalModalContentBodyScene() {
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useCreateProposalCtx();
  const [newTokenInfo, setNewTokenInfo] = useState<
    AttentionTokenEntity | undefined
  >(tokenInfo);
  const { upsertOneToAttTokens } = useCacheCastAttToken();
  const { upsertProposalShareModal } = useAppModals();
  return (
    <ScrollView
      className="max-h-[80vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex w-full flex-col gap-4">
        {!!newTokenInfo ? (
          <CreateProposalModalContentBody
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={newTokenInfo}
            onCreateProposalSuccess={() => {
              Toast.show({
                type: "success",
                text1: "Upvote successful !",
              });
              setOpen(false);
              upsertProposalShareModal({
                open: true,
                cast,
                channel,
                proposal,
              });
            }}
            onCreateProposalError={(error) => {
              Toast.show({
                type: "error",
                text1: error.message,
              });
            }}
          />
        ) : (
          <CreateTokenModalContentBody
            cast={cast}
            channel={channel}
            onCreateTokenSuccess={(tokenInfo) => {
              setNewTokenInfo(tokenInfo);
              upsertOneToAttTokens(channel?.channelId!, tokenInfo);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

function CreateTokenModalContentBody({
  cast,
  channel,
  onCreateTokenSuccess,
}: CastProposeStatusProps & {
  onCreateTokenSuccess?: (tokenInfo: AttentionTokenEntity) => void;
}) {
  return (
    <>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Cast Status:</Text>
        <Text className="text-sm">Pending activation</Text>
      </View>
      <ProposalCastCard channel={channel} cast={cast} />
      <Text className="text-sm text-secondary">
        This channel hasn't activated Curation Token yet. Please activate first.
      </Text>
      <CreateTokenButton
        channelId={channel?.channelId!}
        onComplete={(data) => {
          onCreateTokenSuccess?.(data);
        }}
        className="h-8"
        variant={"secondary"}
        renderButtonContent={({ loading }) => {
          return loading ? (
            <PercentPrograssText duration={8000} divisor={100} />
          ) : (
            <Text>Activate</Text>
          );
        }}
      />
    </>
  );
}

function CreateProposalModalContentBody({
  cast,
  channel,
  // proposal,
  tokenInfo,
  onCreateProposalSuccess,
  onCreateProposalError,
}: CastProposeStatusProps & {
  onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
  onCreateProposalError?: (error: any) => void;
}) {
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
    });

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  const minPayAmountNumber = tokenInfo?.danConfig.proposalStake || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );

  useEffect(() => {
    if (minAmount) {
      setSelectedPayAmount(minAmount);
    }
  }, [minAmount]);

  return (
    <>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Cast Status:</Text>
        <Text className="text-sm">Voteable</Text>
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      {paymentTokenInfoLoading ? (
        <Loading />
      ) : (
        <>
          <ProposalPaymentSelector
            paymentInfoType={PaymentInfoType.Create}
            defaultPaymentInfo={{
              tokenInfo: paymentTokenInfo!,
              recommendedAmount: minAmount,
              minAmount: minAmount,
            }}
            selectedPaymentToken={selectedPaymentToken!}
            setSelectedPaymentToken={setSelectedPaymentToken}
            selectedPayAmount={selectedPayAmount!}
            setSelectedPayAmount={setSelectedPayAmount}
          />
          <ProposeWriteButton
            cast={cast}
            channel={channel}
            // proposal={proposal}
            tokenInfo={tokenInfo}
            paymentTokenInfo={paymentTokenInfo!}
            usedPaymentTokenInfo={selectedPaymentToken}
            paymentTokenInfoLoading={paymentTokenInfoLoading}
            paymentAmount={selectedPayAmount!}
            onCreateProposalSuccess={onCreateProposalSuccess}
            onCreateProposalError={onCreateProposalError}
          />
        </>
      )}
    </>
  );
}
