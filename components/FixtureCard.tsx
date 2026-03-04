import { TeamBadge } from "@/app/teams/page";
import { TEAM_NAMES, type Fixture } from "@/lib/fpl";

// ── helpers ───────────────────────────────────────────────────────────────────

function teamName(id: number) {
  return TEAM_NAMES[id] ?? { name: `Team ${id}`, short: `T${id}` };
}

function formatKickoff(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "TBC", time: "" };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// ── component ─────────────────────────────────────────────────────────────────

interface FixtureCardProps {
  fixture: Fixture;
}

export default function FixtureCard({ fixture }: FixtureCardProps) {
  const home = teamName(fixture.team_h);
  const away = teamName(fixture.team_a);
  const { date, time } = formatKickoff(fixture.kickoff_time);
  const finished = fixture.finished;
  const live = fixture.started && !fixture.finished;

  return (
    <article className="relative bg-gray-900 border border-gray-800 rounded-lg px-4 pt-3 pb-2.5 hover:border-gray-700 hover:translate-x-1 transition-all duration-150 overflow-hidden">
      {/* Live badge */}
      {live && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-bl-md animate-pulse">
          LIVE
        </span>
      )}

      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home team */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center gap-3">
            <TeamBadge teamCode={home.code} teamName={home.name} />{" "}
            <span className="font-semibold text-gray-200 uppercase tracking-wide text-sm truncate hidden sm:block">
              {home.name}
            </span>
            <span className="font-semibold text-gray-200 uppercase tracking-wide text-sm sm:hidden">
              {home.short}
            </span>
          </div>
        </div>

        {/* Score / vs */}
        <div className="flex flex-col items-center min-w-[72px]">
          {finished || live ? (
            <span className="text-white font-extrabold text-xl tracking-tight leading-none">
              {fixture.team_h_score ?? 0}
              <span className="text-gray-600 mx-1">–</span>
              {fixture.team_a_score ?? 0}
            </span>
          ) : (
            <span className="text-gray-600 font-bold text-sm uppercase tracking-widest">
              vs
            </span>
          )}

          {time && (
            <span className="text-gray-600 text-[11px] tracking-wide mt-0.5">
              {time}
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center justify-end gap-2.5">
          <div className="flex flex-col items-center gap-3">
            <TeamBadge teamCode={away.code} teamName={away.name} />{" "}
            <span className="font-semibold text-gray-200 uppercase tracking-wide text-sm truncate hidden sm:block">
              {away.name}
            </span>
            <span className="font-semibold text-gray-200 uppercase tracking-wide text-sm sm:hidden">
              {away.short}
            </span>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
        <span className="text-[11px] text-gray-600 tracking-wide">{date}</span>

        {finished && (
          <span className="text-[11px] font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
            FT
          </span>
        )}
      </div>
    </article>
  );
}
