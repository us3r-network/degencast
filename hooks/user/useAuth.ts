import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ApiRespCode } from "~/services/shared/types";
import { login as signupDegencast } from "~/services/user/api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectUserAuth,
  setDegencastId,
  setJustRegistered,
} from "~/features/user/userAuthSlice";

export default function useAuth() {
  const { user: privyUser, authenticated: privyAuthenticated } = usePrivy();
  const dispatch = useAppDispatch();

  const { degencastId, justRegistered } = useAppSelector(selectUserAuth);

  const syncDegencastId = async (privyDid: string) => {
    const existId = await AsyncStorage.getItem(`degencastId_${privyDid}`);
    if (existId) {
      dispatch(setDegencastId(parseInt(existId)));
    } else {
      const resp = await signupDegencast();
      console.log("login resp", resp);
      if (resp.data?.code === ApiRespCode.SUCCESS) {
        const id = resp.data?.data?.id;
        if (id) {
          await AsyncStorage.setItem(`degencastId_${privyDid}`, id.toString());
          dispatch(setJustRegistered(true));
          dispatch(setDegencastId(id));
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

  useEffect(() => {
    if (!privyAuthenticated) {
      dispatch(setJustRegistered(false));
      dispatch(setDegencastId(""));
    }
  }, [privyAuthenticated]);

  return {
    // user: { ...privyUser, degencastId },
    authenticated: privyAuthenticated && degencastId,
    degencastId,
    justRegistered,
  };
}
