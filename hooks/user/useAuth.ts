import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ApiRespCode } from "~/services/shared/types";
import { login as signupDegencast } from "~/services/user/api";

export default function useAuth() {
  const { user: privyUser, authenticated: privyAuthenticated } = usePrivy();
  // todo: make this global if needed
  const [degencastId, setDegencastId] = useState<number | null>(null);

  const syncDegencastId = async (privyDid: string) => {
    const existId = await AsyncStorage.getItem(`degencastId_${privyDid}`);
    if (existId) {
      setDegencastId(parseInt(existId));
    } else {
      const resp = await signupDegencast();
      console.log("login resp", resp);
      if (resp.data?.code === ApiRespCode.SUCCESS) {
        const id = resp.data?.data?.id;
        if (id) {
          await AsyncStorage.setItem(`degencastId_${privyDid}`, id.toString());
          setDegencastId(id);
        }
      } else {
        console.log("degencast login error: ", resp);
      }
    }
  };

  useEffect(() => {
    const privyDid = privyUser?.id;
    if (privyAuthenticated && privyDid && !degencastId) {
      syncDegencastId(privyDid);
    }
  }, [privyAuthenticated, degencastId]);

  return {
    // user: { ...privyUser, degencastId },
    authenticated: privyAuthenticated && degencastId,
  };
}
