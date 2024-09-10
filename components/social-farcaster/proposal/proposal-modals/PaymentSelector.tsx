import { View } from "react-native";
import PriceRow from "./PriceRow";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import { PriceRangeRow } from "./ChallengeProposalModal";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { formatUnits, parseUnits } from "viem";
import UserTokenSelect from "~/components/trade/UserTokenSelect";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { useSwap } from "~/hooks/trade/useUniSwapV3";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useAccount } from "wagmi";
import { useUserNativeToken } from "~/hooks/user/useUserTokens";
import { NATIVE_TOKEN_ADDRESS } from "~/constants/chain";

export function ProposalPaymentSelector({
  defaultPaymentInfo,
  selectedPaymentToken,
  setSelectedPaymentToken,
  selectedPayAmount,
  setSelectedPayAmount,
  title,
}: {
  defaultPaymentInfo: {
    tokenInfo: TokenWithTradeInfo;
    tokenInfoLoading?: boolean;
    recommendedAmount?: bigint;
    recommendedAmountLoading?: boolean;
    minAmount?: bigint;
  };
  selectedPaymentToken: TokenWithTradeInfo;
  setSelectedPaymentToken: (token: TokenWithTradeInfo) => void;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  title: string;
}) {
  const { supportAtomicBatch } = useWalletAccount();
  const account = useAccount();

  const {
    tokenInfo: defaultTokenInfo,
    recommendedAmount: defaultRecommendedAmount,
    recommendedAmountLoading: defaultRecommendedAmountLoading,
    minAmount: defaultMinAmount,
  } = defaultPaymentInfo;

  const { token: ethTokenInfo } = useUserNativeToken(
    account.address,
    defaultTokenInfo.chainId,
  );

  const {
    fetchSellAmountAsync: fetchEthAmountAsync,
    fetchBuyAmountAsync: fetchDefaultTokenAmountAsync,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
  });

  const {
    fetchSellAmount: fetchEthRecommendedAmount,
    sellAmount: fetchedEthRecommendedAmount,
    ready: swapRecommendedReady,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
    poolFee: FeeAmount.HIGH,
  });

  const {
    fetchSellAmount: fetchEthMinAmount,
    sellAmount: fetchedEthMinAmount,
    ready: swapMinReady,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
    poolFee: FeeAmount.HIGH,
  });

  const isSelectedEthToken =
    selectedPaymentToken?.address === ethTokenInfo?.address;
  const recommendedPayAmount = isSelectedEthToken
    ? fetchedEthRecommendedAmount
    : defaultRecommendedAmount;

  const minPayAmount = isSelectedEthToken
    ? fetchedEthMinAmount
    : defaultMinAmount;

  const handleTokenChange = async (token: TokenWithTradeInfo) => {
    if (token.address === selectedPaymentToken.address) {
      return;
    }
    if (!ethTokenInfo?.address) {
      return;
    }
    setSelectedPaymentToken(token);
    if (token.address === ethTokenInfo.address) {
      if (
        swapRecommendedReady &&
        defaultRecommendedAmount &&
        !fetchedEthRecommendedAmount
      ) {
        fetchEthRecommendedAmount(defaultRecommendedAmount);
      }
      if (swapMinReady && defaultMinAmount && !fetchedEthMinAmount) {
        fetchEthMinAmount(defaultMinAmount);
      }
    }
    if (Number(selectedPayAmount) === 0) {
      setSelectedPayAmount(0n);
      return;
    }
    if (token.address === ethTokenInfo.address) {
      const amount = await fetchEthAmountAsync(selectedPayAmount);
      console.log("fetchEthAmountAsync", {
        selectedPayAmount,
        token,
        amount,
      });
      setSelectedPayAmount(amount);
    } else {
      const amount = await fetchDefaultTokenAmountAsync(selectedPayAmount);
      console.log("fetchDefaultTokenAmountAsync", {
        selectedPayAmount,
        token,
        amount,
      });
      setSelectedPayAmount(amount);
    }
  };
  return (
    <View className="flex flex-col gap-4">
      {supportAtomicBatch(ATT_CONTRACT_CHAIN.id) && (
        <UserTokenSelect
          selectToken={handleTokenChange}
          chain={ATT_CONTRACT_CHAIN}
          defaultToken={defaultTokenInfo}
        />
      )}

      <PaymentInfo
        paymentTokenInfo={selectedPaymentToken}
        recommendedPayAmount={recommendedPayAmount || 0n}
        minPayAmount={minPayAmount || 0n}
        selectedPayAmount={selectedPayAmount}
        setSelectedPayAmount={setSelectedPayAmount}
        title={title}
      />
    </View>
  );
}

export function PaymentInfo({
  paymentTokenInfo,
  recommendedPayAmount,
  minPayAmount,
  selectedPayAmount,
  setSelectedPayAmount,
  amountLoading,
  sliderStep,
  title,
}: {
  paymentTokenInfo: TokenWithTradeInfo;
  recommendedPayAmount?: bigint;
  minPayAmount: bigint;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  amountLoading?: boolean;
  sliderStep?: number;
  title: string;
}) {
  const recommendedPayAmountNumber =
    recommendedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(recommendedPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const minPayAmountNumber =
    minPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(minPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const selectedPayAmountNumber =
    selectedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(selectedPayAmount, paymentTokenInfo?.decimals!))
      : 0;

  console.log("selectedPaymentTokenInfo", paymentTokenInfo);
  console.log("selectedPayAmountNumber", selectedPayAmountNumber);
  console.log("minPayAmountNumber", minPayAmountNumber);

  const priceSliderConfig = {
    value: paymentTokenInfo?.balance ? selectedPayAmountNumber : 0,
    max: Number(paymentTokenInfo?.balance || 0),
    min: paymentTokenInfo?.balance ? minPayAmountNumber || 0 : 0,
    step: sliderStep || recommendedPayAmountNumber / 100,
    maximumFractionDigits:
      paymentTokenInfo.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
  };

  return (
    <View className="flex flex-col gap-4">
      <PriceRow
        title={title}
        paymentTokenInfo={paymentTokenInfo}
        price={recommendedPayAmount}
        isLoading={amountLoading}
        onClickPriceValue={() => {
          if (recommendedPayAmount) {
            setSelectedPayAmount(recommendedPayAmount);
          }
        }}
      />
      <Slider
        {...priceSliderConfig}
        disabled={!paymentTokenInfo?.balance}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const vInt = Number(v);
            setSelectedPayAmount(
              parseUnits(vInt.toString(), paymentTokenInfo?.decimals!),
            );
          }
        }}
      />
      <PriceRangeRow {...priceSliderConfig} />
      <Text className="text-center text-xs text-secondary">
        Stake {paymentTokenInfo.symbol}, get funds back and earn minting fee
        rewards upon success!
      </Text>
    </View>
  );
}
