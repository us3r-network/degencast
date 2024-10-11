import React, {
  forwardRef,
  LegacyRef,
  useState
} from "react";
import Toast from "react-native-toast-message";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { createToken } from "~/services/trade/api";

export const CreateTokenButton = forwardRef(function (
  {
    channelId,
    onComplete,
    text,
    renderButtonContent,
    ...props
  }: ButtonProps & {
    channelId: string;
    onComplete?: (data: AttentionTokenEntity) => void;
    text?: string;
    renderButtonContent?: (props: { loading?: boolean }) => React.ReactNode;
  },
  ref: LegacyRef<typeof Button>,
) {
  return null;
  // const { currFid } = useFarcasterAccount();
  // const [loading, setLoading] = useState(false);
  // return (
  //   <Button
  //     size="sm"
  //     className="w-14"
  //     variant="secondary"
  //     disabled={loading || !currFid}
  //     onPress={async () => {
  //       if (!channelId || !currFid) return;
  //       setLoading(true);
  //       const resp = await createToken(channelId, currFid);
  //       setLoading(false);
  //       const attentionTokenAddr = resp.data?.data?.tokenContract;
  //       if (attentionTokenAddr) {
  //         Toast.show({
  //           type: "success",
  //           text1: "Token Created",
  //           text2: "You can now trade your token",
  //         });
  //         onComplete?.(resp.data.data);
  //       } else {
  //         Toast.show({
  //           type: "error",
  //           text1: "Token Creation Failed",
  //           text2: "Please try again later",
  //         });
  //         return;
  //       }
  //     }}
  //     {...props}
  //   >
  //     {renderButtonContent ? (
  //       renderButtonContent({ loading })
  //     ) : (
  //       <Text>{text || `Create`}</Text>
  //     )}
  //   </Button>
  // );
});
