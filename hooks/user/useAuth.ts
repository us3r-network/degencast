import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef } from "react";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { login as signupDegencast } from "~/services/user/api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectUserAuth,
  setDegencastId,
  setDegencastLoginRequestStatus,
} from "~/features/user/userAuthSlice";
import useUserInviteCode from "./useUserInviteCode";

export default function useAuth() {
  const { user: privyUser, authenticated: privyAuthenticated } = usePrivy();
  const dispatch = useAppDispatch();

  const { degencastId, degencastLoginRequestStatus } =
    useAppSelector(selectUserAuth);
  const degencastLoginPending =
    degencastLoginRequestStatus === AsyncRequestStatus.PENDING;

  const { usedInviterFid } = useUserInviteCode();
  const inviterFidRef = useRef<string | number>("");
  useEffect(() => {
    inviterFidRef.current = usedInviterFid;
  }, [usedInviterFid]);

  const syncDegencastId = async (privyDid: string) => {
    dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.PENDING));
    const existId = await AsyncStorage.getItem(`degencastId_${privyDid}`);
    if (existId) {
      dispatch(setDegencastId(parseInt(existId)));
      dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED));
    } else {
      try {
        const resp = await signupDegencast({
          inviterFid: inviterFidRef.current,
        });
        console.log("login resp", resp);
        if (resp.data?.code === ApiRespCode.SUCCESS) {
          const id = resp.data?.data?.id;
          if (id) {
            await AsyncStorage.setItem(
              `degencastId_${privyDid}`,
              id.toString(),
            );
            dispatch(setDegencastId(id));
          }
          dispatch(
            setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED),
          );
        } else {
          throw new Error("degencast login error: " + resp.data?.msg || "");
        }
      } catch (error) {
        dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.REJECTED));
      }
    }
  };

  const checkDegencastLogin = useCallback(async () => {
    if (degencastLoginPending) return;
    const privyDid = privyUser?.id;
    if (privyAuthenticated && privyDid && !degencastId) {
      syncDegencastId(privyDid);
    }
  }, [privyAuthenticated, privyUser, degencastId, degencastLoginPending]);

  return {
    // user: { ...privyUser, degencastId },
    authenticated: privyAuthenticated && degencastId,
    degencastId,
    degencastLoginPending,
    checkDegencastLogin,
  };
}
