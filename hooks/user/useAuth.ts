import { User, useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
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
import { INVITE_ONLY } from "~/constants";
import Toast from "react-native-toast-message";
import { eventBus, EventTypes } from "~/utils/eventBus";

export default function useAuth() {
  const {
    ready: privyReady,
    user: privyUser,
    authenticated: privyAuthenticated,
  } = usePrivy();

  const dispatch = useAppDispatch();

  const { degencastId, degencastLoginRequestStatus } =
    useAppSelector(selectUserAuth);

  const { usedInviterFid } = useUserInviteCode();
  const inviterFidRef = useRef<string | number>("");
  useEffect(() => {
    inviterFidRef.current = usedInviterFid;
  }, [usedInviterFid]);

  const syncDegencastId = async (privyDid: string) => {
    // console.log("syncDegencastId", privyDid);
    dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.PENDING));
    const existId = await AsyncStorage.getItem(`degencastId_${privyDid}`);
    if (existId) {
      // console.log("exist degencast id", existId);
      dispatch(setDegencastId(parseInt(existId)));
      dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED));
      return existId;
    } else {
      try {
        const resp = await getMyDegencast();
        // console.log("my degencast resp", resp);
        if (resp.data?.code === ApiRespCode.SUCCESS) {
          // console.log("my degencast id", resp.data?.data?.id);
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
        // console.log("degencast id error", error);
        dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.REJECTED));
        return null;
      }
    }
  };
  const checkDegencastLogin = useCallback(async () => {
    if (degencastLoginRequestStatus === AsyncRequestStatus.PENDING) return;
    const privyDid = privyUser?.id;
    if (privyAuthenticated && privyDid && !degencastId) {
      syncDegencastId(privyDid);
    }
  }, [privyAuthenticated, degencastId]);

  const [status, setStatus] = useState<SigninStatus>(SigninStatus.IDLE);
  const privyLoginHanler = {
    onComplete: (
      user: User,
      isNewUser: boolean,
      wasAlreadyAuthenticated: boolean,
    ) => {
      // console.log(
      //   "privy login completed: ",
      //   user,
      //   isNewUser,
      //   wasAlreadyAuthenticated,
      //   status,
      // );
      if (status === SigninStatus.LOGGINGIN_PRIVY) {
        setStatus(SigninStatus.LOGGINGIN_DEGENCAST);
        syncDegencastId(user.id).then((degencastId) => {
          // console.log("degencastId", degencastId);
          if (degencastId) {
            setStatus(SigninStatus.SUCCESS);
            loginHandler?.onSuccess?.();
          } else {
            // console.log("need signup", INVITE_ONLY);
            if (INVITE_ONLY) {
              setStatus(SigninStatus.NEED_INVITE_CODE);
              eventBus.next({
                type: EventTypes.USER_SIGNUP_SHOW_INVITE_CODE_MODEL,
              });
            } else {
              signupDegencast();
            }
          }
        });
      }
    },
    onError: (error: unknown) => {
      // console.error("Failed to login", error);
      setStatus(SigninStatus.FAILED);
      loginHandler?.onFail?.(error);
    },
  };

  const signupDegencast = async (inviteCode?: string) => {
    dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.PENDING));
    setStatus(SigninStatus.LOGGINGIN_DEGENCAST);
    try {
      const resp = await loginDegencast({
        inviterFid: inviterFidRef.current,
        inviteCode,
      });
      // console.log("login resp", resp);
      if (resp.data?.code === ApiRespCode.SUCCESS) {
        const id = resp.data?.data?.id;
        if (id) {
          dispatch(setDegencastId(id));
          setStatus(SigninStatus.SUCCESS);
          eventBus.next({ type: EventTypes.USER_SIGNUP_SUCCESS });
        }
        dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.FULFILLED));
      } else if (resp.data?.code === ApiRespCode.ERROR && resp.data?.msg) {
        Toast.show({
          type: "error",
          text1: resp.data?.msg,
        });
        logout();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to sign up!",
        });
        logout();
      }
    } catch (error) {
      dispatch(setDegencastLoginRequestStatus(AsyncRequestStatus.REJECTED));
    }
  };

  const { login: privyLogin } = useLogin(privyLoginHanler);
  const [loginHandler, setLoginHandler] = useState<LoginHander>();

  const login = async (
    opts?: any,
    onSuccess?: () => void,
    onFail?: (error: unknown) => void,
  ) => {
    // const { onSuccess, onFail } = opts || {};
    if (privyAuthenticated) await logout();
    setLoginHandler({
      onSuccess,
      onFail,
    });
    setStatus(SigninStatus.LOGGINGIN_PRIVY);
    privyLogin(opts);
  };

  const privyLogoutHanler = {
    onSuccess: () => {
      if (status !== SigninStatus.IDLE) {
        console.log("privy logout");
        setStatus(SigninStatus.IDLE);
        dispatch(setDegencastId(""));
      }
    },
  };
  const { logout } = useLogout(privyLogoutHanler);
  return {
    ready: privyReady,
    authenticated: privyAuthenticated && degencastId,
    degencastId,
    checkDegencastLogin,
    status,
    signupDegencast,
    login,
    logout,
  };
}

type LoginHander = {
  onSuccess?: () => void;
  onFail?: (error: unknown) => void;
};

export enum SigninStatus {
  IDLE,
  LOGGINGIN_PRIVY,
  LOGGINGIN_DEGENCAST,
  NEED_INVITE_CODE,
  SUCCESS,
  FAILED,
}
