import CastListWithChannel from "~/components/social-farcaster/proposal/CastListWithChannel";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserCasts from "~/hooks/user/useUserCasts";
import useUserCurationCasts from "~/hooks/user/useUserCurationCasts";

export function UserCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, loadItems, hasNext } = useUserCasts(fid, currFid);
  return (
    <CastListWithChannel
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0) || !hasNext) return;
        loadItems();
        return;
      }}
    />
  );
}

export function UserCurationCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, loadItems, hasMore } = useUserCurationCasts(
    fid,
    currFid,
  );
  return (
    <CastListWithChannel
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0) || !hasMore) return;
        loadItems();
        return;
      }}
    />
  );
}
