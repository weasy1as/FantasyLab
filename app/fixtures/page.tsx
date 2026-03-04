import { getFixtures, type Fixture } from "@/lib/fpl";
import FixturesBrowser from "@/components/FixturesBrowser";

function groupByGameweek(
  fixtures: Fixture[],
): { gw: string; fixtures: Fixture[] }[] {
  const map = new Map<string, Fixture[]>();

  for (const f of fixtures) {
    const key = f.event ? `GW ${f.event}` : "Unscheduled";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }

  // Sort: numbered GWs first in order, then "Unscheduled" at the end
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const numA = parseInt(a.replace("GW ", ""));
      const numB = parseInt(b.replace("GW ", ""));
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    })
    .map(([gw, fixtures]) => ({ gw, fixtures }));
}

/**
 * Finds the index of the "current" gameweek:
 * 1. A GW with at least one live (started, not finished) fixture
 * 2. The earliest GW that has unfinished fixtures (upcoming)
 * 3. The last finished GW as fallback
 */
function getCurrentGwIndex(
  groups: { gw: string; fixtures: Fixture[] }[],
): number {
  // 1. Live GW — has started but unfinished fixtures
  const liveIndex = groups.findIndex((g) =>
    g.fixtures.some((f) => f.started && !f.finished),
  );
  if (liveIndex !== -1) return liveIndex;

  // 2. Next upcoming GW — earliest with all fixtures not yet started
  const upcomingIndex = groups.findIndex((g) =>
    g.fixtures.some((f) => !f.started && !f.finished && f.event !== null),
  );
  if (upcomingIndex !== -1) return upcomingIndex;

  // 3. Fallback: last group
  return groups.length - 1;
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function FixturesPage() {
  const fixtures = await getFixtures();
  const grouped = groupByGameweek(fixtures);
  const currentGwIndex = getCurrentGwIndex(grouped);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-end gap-4 mb-10 pb-6 border-b border-gray-800">
          <h1 className="text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
            Fix<span className="text-emerald-400">tures</span>
          </h1>
          <span className="text-xs text-gray-600 uppercase tracking-widest pb-1">
            {fixtures.length} matches
          </span>
        </div>

        {/* Paginated browser — client component */}
        <FixturesBrowser
          groupedFixtures={grouped}
          currentGwIndex={currentGwIndex}
        />
      </div>
    </main>
  );
}
