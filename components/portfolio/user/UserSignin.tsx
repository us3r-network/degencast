import { User, useLogin, useLogout } from "@privy-io/react-auth";
import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { INVITE_ONLY } from "~/constants";
import useAuth from "~/hooks/user/useAuth";

enum SigninStatus {
  IDLE,
  LOGGINGIN_PRIVY,
  LOGGINGIN_DEGENCAST,
  NO_DEGENCAST_ID,
  SUCCESS,
  FAILED,
}

export default function UserSignin({
  onSuccess,
  onFail,
  showCancelButton = false,
}: {
  onSuccess: () => void;
  onFail: (error: unknown) => void;
  showCancelButton: boolean;
}) {
  const [status, setStatus] = useState<SigninStatus>(SigninStatus.IDLE);
  const { authenticated, syncDegencastId, signupDegencast } = useAuth();

  const loginHanler = {
    onComplete: (
      user: User,
      isNewUser: boolean,
      wasAlreadyAuthenticated: boolean,
    ) => {
      console.log("privy login", user, isNewUser, wasAlreadyAuthenticated);
      setStatus(SigninStatus.LOGGINGIN_DEGENCAST);
      syncDegencastId(user.id).then((degencastId) => {
        console.log("degencastId", degencastId);
        if (degencastId) {
          setStatus(SigninStatus.SUCCESS);
          onSuccess();
        } else {
          if (INVITE_ONLY) {
            setStatus(SigninStatus.NO_DEGENCAST_ID);
          } else {
            signup();
          }
        }
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to login", error);
      setStatus(SigninStatus.FAILED);
      onFail(error);
    },
  };
  const { login } = useLogin(loginHanler);
  const { logout } = useLogout();
  const [inviteCode, setInviteCode] = useState<string>("");
  const signup = async () => {
    setStatus(SigninStatus.LOGGINGIN_DEGENCAST);
    const resp = await signupDegencast(inviteCode);
    if (resp) {
      setStatus(SigninStatus.SUCCESS);
      onSuccess();
    } else {
      setStatus(SigninStatus.NO_DEGENCAST_ID);
      Toast.show({
        type: "error",
        text1: "Failed to sign up",
      });
    }
  };

  const cancel = () => {
    onFail("user cancel sign in!");
    logout();
    setInviteCode("");
    setStatus(SigninStatus.IDLE);
  };

  switch (status) {
    case SigninStatus.IDLE:
    case SigninStatus.FAILED:
    case SigninStatus.LOGGINGIN_PRIVY:
      return (
        <Button
          variant="secondary"
          className="w-1/2 rounded-full"
          onPress={() => {
            setStatus(SigninStatus.LOGGINGIN_PRIVY);
            login();
          }}
        >
          <Text>Sign in</Text>
        </Button>
      );
    case SigninStatus.LOGGINGIN_DEGENCAST:
      return <Text>Logging in Degencast...</Text>;
    case SigninStatus.NO_DEGENCAST_ID:
      return (
        <View className="w-1/2 flex-row items-center gap-1 rounded-full border-2 border-secondary bg-white p-1">
          <Input
            className="flex-1 rounded-full border-none bg-transparent p-1 text-secondary"
            placeholder="Fill in invitation code"
            value={inviteCode}
            onChangeText={(newText) => setInviteCode(newText)}
          />
          <Button variant="default" className="rounded-full" onPress={signup}>
            <Text>Submit</Text>
          </Button>
          {showCancelButton && (
            <Button variant="default" className="rounded-full" onPress={cancel}>
              <Text>Cancel</Text>
            </Button>
          )}
        </View>
      );
    case SigninStatus.SUCCESS:
      return <Text>Signed in</Text>;
  }
}
