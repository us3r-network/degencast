import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useRouter } from "expo-router";
import {
  ChannelExploreData,
  selectChannelExplorePage,
  upsertChannelExploreData,
} from "~/features/community/channelExplorePageSlice";
import getCastHex from "~/utils/farcaster/getCastHex";

export default function useChannelExplorePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { channelExploreData } = useAppSelector(selectChannelExplorePage);

  const navigateToChannelExplore = useCallback(
    (channelId: string, params: ChannelExploreData) => {
      dispatch(upsertChannelExploreData({ id: channelId, params }));
      let query = "";
      const { cast } = params;
      if (cast) {
        query = `?cast=${getCastHex(cast)}`;
      }
      router.push(`channel-explore/${channelId}${query}` as any);
    },
    [router],
  );

  return {
    channelExploreData,
    navigateToChannelExplore,
  };
}
