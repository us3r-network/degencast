import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { getMyDegencast, loginDegencast } from "~/services/user/api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectUserAuth,
  setDegencastId,
  setDegencastLoginRequestStatus,
} from "~/features/user/userAuthSlice";
import useUserInviteCode from "./useUserInviteCode";

export default function useAuth() {
  const {
    user: privyUser,
    authenticated: privyAuthenticated,
    logout,
  } = usePrivy();
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
    console.log("syncDegencastId", privyDid)
    dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.PENDING));
    const existId = await AsyncStorage.getItem(`degencastId_${privyDid}`);
    if (existId) {
      console.log("exist degencast id", existId);
      dispatch(setDegencastId(parseInt(existId)));
      dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED));
      return existId;
    } else {
      try {
        const resp = await getMyDegencast();
        console.log("my degencast resp", resp);
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
          return id;
        } else {
          throw new Error("degencast id error: " + resp.data?.msg || "");
        }
      } catch (error) {
        console.log("degencast id error", error);
        dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.REJECTED));
        return null;
      }
    }
  };
  const checkDegencastLogin = useCallback(async () => {
    if (degencastLoginPending) return;
    const privyDid = privyUser?.id;
    if (privyAuthenticated && privyDid && !degencastId) {
      syncDegencastId(privyDid);
    }
  }, [privyAuthenticated, privyUser, degencastId]);

  const signupDegencast = async (inviteCode?: string) => {
    dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.PENDING));
    try {
      const resp = await loginDegencast({
        inviterFid: inviterFidRef.current,
        inviteCode,
      });
      console.log("login resp", resp);
      if (resp.data?.code === ApiRespCode.SUCCESS) {
        const id = resp.data?.data?.id;
        if (id) {
          dispatch(setDegencastId(id));
        }
        dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED));
        return id;
      } else {
        throw new Error("degencast login error: " + resp.data?.msg || "");
      }
    } catch (error) {
      dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.REJECTED));
      return null;
    }
  };

  return {
    // user: { ...privyUser, degencastId },
    authenticated: privyAuthenticated && degencastId,
    degencastId,
    syncDegencastId,
    signupDegencast,
    checkDegencastLogin,
  };
}
