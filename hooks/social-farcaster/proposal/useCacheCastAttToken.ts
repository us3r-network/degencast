import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectCastAttToken,
  upsertOneToAttTokens,
} from "~/features/cast/castAttTokenSlice";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

export default function useCacheCastAttToken() {
  const dispatch = useAppDispatch();
  const { attTokens } = useAppSelector(selectCastAttToken);

  const upsertOneToAttTokensFn = useCallback(
    (channelId: string, tokenInfo: AttentionTokenEntity) => {
      dispatch(upsertOneToAttTokens({ channelId, tokenInfo }));
    },
    [],
  );

  const getCachedAttToken = useCallback(
    (channelId: string) => {
      return attTokens?.[channelId] || null;
    },
    [attTokens],
  );
  return {
    attTokens,
    upsertOneToAttTokens: upsertOneToAttTokensFn,
    getCachedAttToken,
  };
}
