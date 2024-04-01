import { useCallback, useEffect, useState } from 'react';
import { getFarcasterUserStats } from '~/services/farcaster/api';


export default function useFarcasterUserStats(fid: number) {
  const [farcasterUserStats, setFarcasterUserStats] = useState({
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
  });

  const getUserStatics = useCallback(async () => {
    if (!fid) return;
    const resp = await getFarcasterUserStats(fid);
    const userStats = resp.data.data;
    setFarcasterUserStats({
      ...userStats,
    });
  }, [fid]);

  useEffect(() => {
    getUserStatics().catch(console.error);
  }, [getUserStatics]);

  return {
    farcasterUserStats,
  };
}
