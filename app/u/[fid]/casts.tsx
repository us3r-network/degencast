import { useLocalSearchParams } from "expo-router";
import { CastList } from "~/components/portfolio/posts/UserCasts";

export default function CastsScreen() {
  const { fid } = useLocalSearchParams<{ fid: string }>();

  if (Number(fid)) {
    return <CastList fid={Number(fid)} />;
  }
}
