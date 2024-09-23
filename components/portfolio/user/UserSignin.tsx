import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useAuth, { SigninStatus } from "~/hooks/user/useAuth";
import { eventBus, EventTypes } from "~/utils/eventBus";

export default function UserSignin({
  onSuccess,
  onFail,
}: {
  onSuccess: () => void;
  onFail: (error: unknown) => void;
}) {
  const { status, login } = useAuth();
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);
  useEffect(() => {
    const subscription = eventBus.subscribe((event) => {
      console.log("event", event);
      if ((event as any).type === EventTypes.USER_SIGNUP_SUCCESS) onSuccess();
      // if ((event as any).type === EventTypes.USER_SIGNUP_FAIL)
      //   onFail("Failed to sign up");
      if ((event as any).type === EventTypes.USER_SIGNUP_SHOW_INVITE_CODE_MODEL)
        setShowInviteCodeModal(true);
      if (
        (event as any).type === EventTypes.USER_SIGNUP_CLOSE_INVITE_CODE_MODEL
      )
        setShowInviteCodeModal(false);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  switch (status) {
    case SigninStatus.IDLE:
    case SigninStatus.FAILED:
    case SigninStatus.LOGGINGIN_PRIVY:
      return (
        <Button
          variant="secondary"
          className="w-1/2 min-w-fit rounded-full"
          onPress={() => {
            // login({ onSuccess });
            console.log("login frome UserSignin");
            login({ loginMethods: ["farcaster"] }, onSuccess, onFail);
          }}
        >
          <Text>Sign in</Text>
        </Button>
      );
    case SigninStatus.LOGGINGIN_DEGENCAST:
    case SigninStatus.NEED_INVITE_CODE:
      if (showInviteCodeModal) {
        return <Text>Logging in Degencast...</Text>;
      } else {
        return (
          <Button
            variant="secondary"
            className="w-1/2 min-w-fit rounded-full"
            onPress={() => {
              eventBus.next({
                type: EventTypes.USER_SIGNUP_SHOW_INVITE_CODE_MODEL,
              });
            }}
          >
            <Text>Input Invite Code</Text>
          </Button>
        );
      }
    case SigninStatus.SUCCESS:
      return <Text>Signed in</Text>;
  }
}
