import { TeamBadge } from "@/app/teams/page";
import { getFixtures, TEAM_NAMES, type Fixture } from "@/lib/fpl";

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "TBC";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface PlayerFixtureRowProps {
  fixture: Fixture;
  teamId: number;
  teamCode: number;
}

function PlayerFixtureRow({ fixture, teamId }: PlayerFixtureRowProps) {
  const isHome = fixture.team_h === teamId;
  const opponentId = isHome ? fixture.team_a : fixture.team_h;
  const opponent = TEAM_NAMES[opponentId] ?? {
    name: `Team ${opponentId}`,
    short: `T${opponentId}`,
  };

  const finished = fixture.finished;
  const live = fixture.started && !fixture.finished;

  // Determine result colour
  let resultColor = "text-neutral-100"; // default

  if (finished) {
    const teamScore = isHome ? fixture.team_h_score : fixture.team_a_score;
    const oppScore = isHome ? fixture.team_a_score : fixture.team_h_score;

    if (teamScore !== null && oppScore !== null) {
      if (teamScore > oppScore) {
        resultColor = "text-emerald-400"; // Win (light green)
      } else if (teamScore < oppScore) {
        resultColor = "text-red-400"; // Loss (red)
      } else {
        resultColor = "text-gray-400"; // Draw (gray)
      }
    }
  }
  console.log(opponent);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-800 last:border-0">
      {/* Opponent + H/A */}
      <div className="flex items-center gap-2 min-w-0">
        <div>
          <TeamBadge teamCode={opponent.code} teamName={opponent.name} />
        </div>
        <span className="text-neutral-100 font-semibold text-sm truncate">
          {opponent.name}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {isHome ? "H" : "A"}
        </span>
      </div>

      {/* Score or date */}
      <div className="flex items-center gap-3">
        {finished || live ? (
          <span
            className={`text-sm font-extrabold tabular-nums ${resultColor}`}
          >
            {isHome
              ? `${fixture.team_h_score}–${fixture.team_a_score}`
              : `${fixture.team_a_score}–${fixture.team_h_score}`}
            {live && (
              <span className="ml-1.5 text-[9px] font-extrabold tracking-widest text-red-400 animate-pulse">
                LIVE
              </span>
            )}
          </span>
        ) : (
          <span className="text-[11px] text-neutral-500">
            {formatDate(fixture.kickoff_time)}
          </span>
        )}
      </div>
    </div>
  );
}
// ── main component ────────────────────────────────────────────────────────────

interface Props {
  teamId: number;
  /** How many upcoming fixtures to show (default 8) */
  limit?: number;
  teamCode: number;
}

export default async function PlayerFixtures({
  teamId,
  limit = 8,
  teamCode,
}: Props) {
  const allFixtures = await getFixtures();

  // All fixtures for this team, sorted by GW
  const teamFixtures = allFixtures
    .filter((f) => f.team_h === teamId || f.team_a === teamId)
    .sort((a, b) => (a.event ?? 999) - (b.event ?? 999));

  // Find current position
  const liveIdx = teamFixtures.findIndex((f) => f.started && !f.finished);
  const upcomingIdx = teamFixtures.findIndex(
    (f) => !f.started && f.event !== null,
  );

  const startIdx =
    liveIdx !== -1 ? liveIdx : upcomingIdx !== -1 ? upcomingIdx : 0;

  // Show `limit` fixtures centred around current one
  const pastCount = 3;
  const from = Math.max(0, startIdx - pastCount);
  const visibleFixtures = teamFixtures.slice(from, from + limit);
  console.log(visibleFixtures);

  const teamName = TEAM_NAMES[teamId]?.name ?? `Team ${teamId}`;

  return (
    <div
      className="w-full max-w-xs
      bg-neutral-900/60 backdrop-blur-xl
      border border-neutral-800
      rounded-3xl
      shadow-2xl
      p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-100">
          Fixtures
        </h3>
        <div>
          <TeamBadge teamCode={teamCode} teamName={teamName} />{" "}
          <span className="text-[10px] uppercase tracking-widest text-neutral-600">
            {teamName}
          </span>
        </div>
      </div>

      {/* Column labels */}
      <div className="flex items-center justify-between px-0 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-neutral-600">
          Opponent
        </span>
        <span className="text-[10px] uppercase tracking-widest text-neutral-600">
          Date / Score
        </span>
      </div>

      {/* Fixture rows */}
      <div>
        {visibleFixtures.map((f) => (
          <PlayerFixtureRow
            key={f.id}
            fixture={f}
            teamId={teamId}
            teamCode={teamCode}
          />
        ))}
      </div>
    </div>
  );
}
