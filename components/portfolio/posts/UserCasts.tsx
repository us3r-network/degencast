import CastListWithChannel from "~/components/social-farcaster/proposal/CastListWithChannel";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserCasts from "~/hooks/user/useUserCasts";
import useUserCurationCasts from "~/hooks/user/useUserCurationCasts";

export function UserCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, load, hasMore } = useUserCasts(fid, currFid);
  return (
    <CastListWithChannel
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0) || !hasMore) return;
        load();
        return;
      }}
    />
  );
}

export function UserCurationCastList({ fid }: { fid: number }) {
  const { currFid } = useFarcasterAccount();
  const { items, loading, load, hasMore } = useUserCurationCasts(
    fid,
    currFid,
  );
  return (
    <CastListWithChannel
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0) || !hasMore) return;
        load();
        return;
      }}
    />
  );
}
