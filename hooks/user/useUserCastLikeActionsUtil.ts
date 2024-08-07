import { useCallback } from "react";
import {
  addManyToLikeActions,
  removeOneFromLikeActions,
  addOneToLikeActionsPendingCastHashes,
  removeOneFromLikeActionsPendingCastHashes,
  selectUserAction,
} from "~/features/user/userActionSlice";
import { getCastUserActions } from "~/services/user/api";
import { UserActionData, UserActionName } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import useAuth from "./useAuth";

export default function useUserCastLikeActionsUtil() {
  const dispatch = useAppDispatch();
  const { login, ready, authenticated } = useAuth();

  const { likeActions, likeActionsPendingCastHashes, actionPointConfig } =
    useAppSelector(selectUserAction);

  const validateLiked = useCallback(
    (castHash: string) => {
      return likeActions.some((likeAction) => likeAction.castHash === castHash);
    },
    [likeActions],
  );
  const validateLikeActionsPending = useCallback(
    (castHash: string) => {
      return likeActionsPendingCastHashes.includes(castHash);
    },
    [likeActionsPendingCastHashes],
  );
  const addManyToLikedActions = useCallback(
    (actionDatas: UserActionData[]) => {
      dispatch(addManyToLikeActions(actionDatas));
    },
    [dispatch],
  );

  const removeOneLidedActions = useCallback(
    (castHash: string) => {
      dispatch(removeOneFromLikeActions(castHash));
    },
    [dispatch],
  );

  const fetchCastLikeActions = useCallback(
    async (castHash: string) => {
      if (
        !authenticated ||
        validateLiked(castHash) ||
        validateLikeActionsPending(castHash)
      )
        return;
      try {
        dispatch(addOneToLikeActionsPendingCastHashes(castHash));
        const res = await getCastUserActions(castHash);
        const { data } = res.data;
        const likeActions = data.filter(
          (action) => action.action === UserActionName.Like,
        ) as UserActionData[];
        dispatch(addManyToLikeActions(likeActions));
      } catch (error) {
        console.error(`fetchCastLikeActions error:`, error);
      } finally {
        dispatch(removeOneFromLikeActionsPendingCastHashes(castHash));
      }
    },
    [authenticated, validateLiked, validateLikeActionsPending],
  );

  return {
    validateLiked,
    validateLikeActionsPending,
    fetchCastLikeActions,
    addManyToLikedActions,
    removeOneLidedActions,
  };
}
