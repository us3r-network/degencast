import { Address } from "viem";
import { base } from "viem/chains";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_ADDRESS } from "~/constants";
import { useERC20Approve } from "~/hooks/trade/useERC20Contract";

type OnChainActionButtonWarperProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  warpedButton?: React.ReactElement;
};

export default function OnChainActionButtonWarper({
  warpedButton,
  takerAddress,
  tokenAddress,
  allowanceTarget,
  allowanceValue,
  targetChainId,
  ...props
}: OnChainActionButtonWarperProps & {
  takerAddress?: Address;
  tokenAddress?: Address;
  allowanceTarget?: Address;
  allowanceValue?: bigint;
} & SwitchChainButtonProps) {
  if (
    !takerAddress ||
    !tokenAddress ||
    !allowanceTarget ||
    !allowanceValue ||
    tokenAddress === NATIVE_TOKEN_ADDRESS
  )
    return (
      <SwitchChainButtonWarper
        targetChainId={targetChainId}
        warpedButton={warpedButton}
        {...props}
      />
    );
  return (
    <ApproveButtonWarper
      takerAddress={takerAddress}
      tokenAddress={tokenAddress}
      allowanceTarget={allowanceTarget}
      allowanceValue={allowanceValue}
      warpedButton={
        <SwitchChainButtonWarper
          targetChainId={targetChainId}
          warpedButton={warpedButton}
          {...props}
        />
      }
      {...props}
    />
  );
}

type ApproveButtonProps = {
  takerAddress: Address;
  tokenAddress: Address;
  allowanceTarget: Address;
  allowanceValue: bigint;
};

function ApproveButtonWarper({
  warpedButton,
  takerAddress,
  tokenAddress,
  allowanceTarget,
  allowanceValue,
  ...props
}: OnChainActionButtonWarperProps & ApproveButtonProps) {
  const { allowance, approve, waiting, writing } = useERC20Approve({
    takerAddress,
    tokenAddress,
    allowanceTarget,
  });
  console.log("allowance", allowance);
  if (allowance === 0n || (!!allowance && allowance < allowanceValue))
    return (
      <Button
        disabled={waiting || writing}
        onPress={async () => {
          await approve(allowanceValue);
        }}
        {...props}
      >
        <Text>Approve</Text>
      </Button>
    );
  else return warpedButton;
}

type SwitchChainButtonProps = {
  targetChainId?: number;
};

function SwitchChainButtonWarper({
  warpedButton,
  targetChainId,
  ...props
}: OnChainActionButtonWarperProps & SwitchChainButtonProps) {
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const chainId = useChainId();
  const chains = useChains();
  const targetChain = chains.find((c) => c.id === targetChainId);
  if (targetChainId && targetChain && targetChainId !== chainId)
    return (
      <Button
        disabled={switchChainStatus === "pending"}
        onPress={async () => {
          await switchChain({ chainId: targetChainId });
        }}
        {...props}
      >
        <Text>Switch to {targetChain.name}</Text>
      </Button>
    );
  else return warpedButton;
}
