import { useCallback } from "react";
import { useAppDispatch } from "~/store/hooks";
import { useRouter } from "expo-router";
import { CommunityEntity } from "~/services/community/types/community";
import { upsertCommunityBasicData } from "~/features/community/communityDetailSlice";

export default function useCommunityPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const navigateToCommunityDetail = useCallback(
    (channelId: string, data: CommunityEntity, childRoutePath?: string) => {
      dispatch(upsertCommunityBasicData({ id: channelId, data: data as any }));
      router.push(`communities/${channelId}/${childRoutePath || ""}` as any);
    },
    [router],
  );

  return {
    navigateToCommunityDetail,
  };
}
