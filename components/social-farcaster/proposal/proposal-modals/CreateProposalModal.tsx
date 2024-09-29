import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import Toast from "react-native-toast-message";
import { formatUnits, parseUnits, TransactionReceipt } from "viem";
import { PercentPrograssText } from "~/components/common/PercentPrograssText";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { CreateTokenButton } from "~/components/onchain-actions/att/ATTCreateButton";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import useCacheCastAttToken from "~/hooks/social-farcaster/proposal/useCacheCastAttToken";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposeWriteButton, {
  ProxyUserToCreateProposalButton,
} from "../proposal-write-buttons/CreateProposalWriteButton";
import ProposalCastCard from "../ProposalCastCard";
import { getProposalErrorInfo } from "../utils";
import { AboutContents } from "~/components/help/HelpButton";
import useAppModals from "~/hooks/useAppModals";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";
import { useAccount } from "wagmi";
import { SECONDARY_COLOR } from "~/constants";
import ProposalErrorModal from "./ProposalErrorModal";
import { PaymentType } from "../ProposalPaymentSelect";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
import useDegencastUserInfo from "~/hooks/user/useDegencastUserInfo";

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
    { key: "vote", title: "Superlike" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    vote: CreateProposalModalContentBodyScene,
    about: AboutContents,
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

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });
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
                text1: "👍 Superlike successful !",
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
              const errInfo = getProposalErrorInfo(error);
              const { shortMessage, message } = errInfo;
              if (message) {
                setErrorModal({ open: true, message });
              } else {
                Toast.show({
                  type: "error",
                  text1: shortMessage,
                });
              }
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
      <ProposalErrorModal
        open={errorModal.open}
        onOpenChange={(o) => {
          setErrorModal((pre) => ({ ...pre, open: o }));
        }}
        message={errorModal.message}
      />
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
        This channel hasn't activated Contribution Token yet. Please activate
        first.
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
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    refetch,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
  });
  const {
    totalDegenAllowance,
    remainingDegenAllowance,
    loadDegenAllowance,
    loading: allowanceLoading,
  } = useUserDegenAllowance();

  const [selectedPaymentType, setSelectedPaymentType] = useState(
    PaymentType.Erc20,
  );

  const { degencastUserInfo } = useDegencastUserInfo();
  const isSuperLikeUser = degencastUserInfo?.isSuperlikeUser;
  useEffect(() => {
    if (isSuperLikeUser) {
      loadDegenAllowance();
      setSelectedPaymentType(PaymentType.Allowance);
    }
  }, [isSuperLikeUser]);

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!paymentTokenInfoLoading && paymentTokenInfo) {
      setSelectedPaymentToken(paymentTokenInfo);
    }
  }, [paymentTokenInfoLoading, paymentTokenInfo]);

  const minPayAmountNumber = tokenInfo?.danConfig?.proposalStake || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );

  useEffect(() => {
    if (minAmount) {
      setSelectedPayAmount(minAmount);
    }
  }, [minAmount]);

  const { address, chainId } = useAccount();

  const preAddress = useRef(address);
  useEffect(() => {
    if (preAddress.current !== address) {
      refetch();
      preAddress.current = address;
    }
  }, [address]);

  const preChainId = useRef(chainId);
  useEffect(() => {
    if (preChainId.current !== chainId) {
      refetch();
      preChainId.current = chainId;
    }
  }, [chainId]);

  const allowanceInfo = {
    paymentAmount: minPayAmountNumber,
    totalAllowance: totalDegenAllowance,
    remainingAllowance: remainingDegenAllowance,
  };

  return (
    <>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Cast Status:</Text>
        <Text className="text-sm">--</Text>
      </View>
      {/* <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} /> */}
      {paymentTokenInfoLoading ? (
        <ActivityIndicator color={SECONDARY_COLOR} />
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
            selectedPaymentType={selectedPaymentType}
            setSelectedPaymentType={setSelectedPaymentType}
            allowanceInfo={allowanceInfo}
          />

          {selectedPaymentType === PaymentType.Allowance ? (
            allowanceLoading ? (
              <ActivityIndicator color={SECONDARY_COLOR} />
            ) : (
              <ProxyUserToCreateProposalButton
                cast={cast}
                channel={channel}
                // proposal={proposal}
                tokenInfo={tokenInfo}
                onCreateProposalSuccess={onCreateProposalSuccess}
                onCreateProposalError={onCreateProposalError}
                allowanceInfo={allowanceInfo}
              />
            )
          ) : (
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
          )}
        </>
      )}
    </>
  );
}
