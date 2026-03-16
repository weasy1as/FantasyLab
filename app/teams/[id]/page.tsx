import Image from "next/image";
import { getBootstrap } from "@/lib/fpl";
import PlayerDisplay from "@/components/PlayerDisplay";

const getBadge = (code: number) =>
  `https://resources.premierleague.com/premierleague25/badges-alt/${code}.svg`;

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getBootstrap();
  const { id } = await params; // ⭐ unwrap params
  const code = Number(id);
  // Find team
  const team = data.teams.find((t: any) => t.code === code);

  // Get players from data.elements
  const players = data.elements.filter((p: any) => p.team_code === code);

  //if (!team) return <div>Team not found</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-10">
      {/* Team header */}
      <div className="flex items-center gap-6 mb-10">
        <Image src={getBadge(code)} alt="" width={70} height={70} />
        <h1 className="text-4xl font-bold">{team.name}</h1>
      </div>

      {/* Players grid */}
      <PlayerDisplay players={players} />
    </main>
  );
}
