import { getBootstrap } from "@/lib/fpl";
import { ComparePage } from "@/components/ComparePage";

export default async function CompareRoute() {
  const data = await getBootstrap();
  const currentGameweek = data.events.find((event: any) => event.is_current)?.id || 1;
  return <ComparePage players={data.elements} gameweek={currentGameweek} />;
}
