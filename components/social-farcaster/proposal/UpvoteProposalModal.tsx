import { useState } from "react";
import { View } from "react-native";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import ProposalCastCard from "./ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { ProposeProposalWriteButton } from "./ProposalWriteButton";
import PriceRow from "./PriceRow";
import { TransactionReceipt } from "viem";
import Toast from "react-native-toast-message";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
};

export default function UpvoteProposalModal({
  cast,
  channel,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-screen">
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
      </DialogContent>
    </Dialog>
  );
}

export function UpvoteProposalModalContentBody({
  cast,
  channel,
  tokenInfo,
  onProposeSuccess,
  onProposeError,
}: CastProposeStatusProps & {
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
}) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const {
    price,
    isLoading,
    error: priceError,
  } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  return (
    <>
      {/* <DialogHeader
        className={cn("mr-4 flex-row items-center justify-between gap-2")}
      >
        <DialogTitle>Upvote</DialogTitle>
      </DialogHeader> */}
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      <PriceRow
        title="Upvote Coast"
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
      />
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        tokenInfo={tokenInfo}
        price={price!}
        onProposeSuccess={onProposeSuccess}
        onProposeError={onProposeError}
      />
    </>
  );
}
