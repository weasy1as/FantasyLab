import { PlayerCard } from "@/components/PlayerCard";
import PlayerFixtures from "@/components/PlayerFixtures";
import { getBootstrap } from "@/lib/fpl";
import { Player } from "@/types/player";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getBootstrap();
  const { id } = await params;

  const player = data.elements.find((p: Player) => p.bps === Number(id));

  if (!player) {
    return <div>Player not found</div>;
  }
  console.log(player.team_code);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-slate-900 via-neutral-900 to-black">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-6 max-w-3xl mx-auto">
        <PlayerCard player={player} />
        <PlayerFixtures teamId={player.team} teamCode={player.team_code} />
      </div>
    </div>
  );
}
