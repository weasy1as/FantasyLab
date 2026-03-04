import { getBootstrap, getTeamBadge } from "@/lib/fpl";
import Image from "next/image";
import Link from "next/link";

type Team = {
  id: number;
  name: string;
  short_name: string;
  position: number;
  strength: number;
  strength_attack_home: number;
  strength_defence_home: number;
  code: number;
};

type Props = {
  teamCode: number;
  teamName: string;
};

export function TeamBadge({ teamCode, teamName }: Props) {
  return (
    <Image
      src={getTeamBadge(teamCode)}
      alt={teamName}
      width={48}
      height={48}
      className="object-contain"
    />
  );
}

export default async function TeamsPage() {
  const data = await getBootstrap();
  const teams: Team[] = data.teams;
  console.log(teams);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Premier League Teams</h1>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TeamCard({ team }: { team: Team }) {
  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{team.name}</h2>

        <div className="flex flex-col items-center gap-2 ">
          <p className="text-sm px-3 py-1 rounded-full bg-purple-600/20 text-purple-400">
            League Position
          </p>{" "}
          <span className="text-sm px-3 py-1 rounded-full bg-purple-600/20 text-purple-400">
            #{team.position}
          </span>
        </div>
      </div>
      <div>
        <TeamBadge teamCode={team.code} teamName={team.name} />
      </div>

      {/* CTA */}
      <Link
        href={`/teams/${team.code}`}
        className="mt-6 block w-full rounded-lg bg-purple-600 py-2 text-center text-sm font-medium transition hover:bg-purple-700"
      >
        View Players
      </Link>
    </div>
  );
}
