import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useAuth, { SigninStatus } from "~/hooks/user/useAuth";

export default function UserSignin({
  onSuccess,
  onFail,
}: {
  onSuccess: () => void;
  onFail: (error: unknown) => void;
}) {
  const { login, status } = useAuth();
  switch (status) {
    case SigninStatus.IDLE:
    case SigninStatus.FAILED:
    case SigninStatus.LOGGINGIN_PRIVY:
      return (
        <Button
          variant="secondary"
          className="w-1/2 min-w-fit rounded-full"
          onPress={() => {
            login({ onSuccess, onFail });
          }}
        >
          <Text>Sign in</Text>
        </Button>
      );
    case SigninStatus.LOGGINGIN_DEGENCAST:
    case SigninStatus.NEED_INVITE_CODE:
      return <Text>Logging in Degencast...</Text>;
    case SigninStatus.SUCCESS:
      return <Text>Signed in</Text>;
  }
}
