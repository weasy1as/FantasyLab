// lib/fpl.ts
const BASE = "https://fantasy.premierleague.com/api";

export async function getBootstrap() {
  try {
    const res = await fetch(`${BASE}/bootstrap-static/`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch bootstrap data");
    }

    return await res.json();
  } catch (error) {
    console.error("FPL API error:", error);

    // fallback so the page doesn't crash
    return { elements: [], teams: [] };
  }
}
export async function getPlayerSummary(id: number) {
  const res = await fetch(`${BASE}/element-summary/${id}/`, {
    next: { revalidate: 1800 },
  });
  return res.json();
}

// lib/getTeamBadge.ts
export function getTeamBadge(code: number | string) {
  return `https://resources.premierleague.com/premierleague25/badges-alt/${code}.svg`;
}

export const getPlayerImg = (photo: string) =>
  `https://resources.premierleague.com/premierleague25/photos/players/110x140/${photo.replace(
    ".jpg",
    "",
  )}.png`;

export interface Fixture {
  code: number;
  event: number | null;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string | null;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean | null;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: unknown[];
  team_h_difficulty: number;
  team_a_difficulty: number;
  pulse_id: number;
}

export async function getFixtures(): Promise<Fixture[]> {
  const res = await fetch("https://fantasy.premierleague.com/api/fixtures", {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch fixtures: ${res.status}`);
  }

  return res.json();
}

// Team name map (FPL team IDs for 2024/25 season)
export const TEAM_NAMES: Record<
  number,
  { name: string; short: string; code: number }
> = {
  1: { name: "Arsenal", short: "ARS", code: 3 },
  2: { name: "Aston Villa", short: "AVL", code: 7 },
  3: { name: "Burnley", short: "BUR", code: 90 },
  4: { name: "Bournemouth", short: "BOU", code: 91 },
  5: { name: "Brentford", short: "BRE", code: 94 },
  6: { name: "Brighton", short: "BHA", code: 36 },
  7: { name: "Chelsea", short: "CHE", code: 8 },
  8: { name: "Crystal Palace", short: "CRY", code: 31 },
  9: { name: "Everton", short: "EVE", code: 11 },
  10: { name: "Fulham", short: "FUL", code: 54 },
  11: { name: "Leeds", short: "LEE", code: 2 },
  12: { name: "Liverpool", short: "LIV", code: 14 },
  13: { name: "Man City", short: "MCI", code: 43 },
  14: { name: "Man Utd", short: "MUN", code: 1 },
  15: { name: "Newcastle", short: "NEW", code: 4 },
  16: { name: "Nott'm Forest", short: "NFO", code: 17 },
  17: { name: "Sunderland", short: "SUN", code: 56 },
  18: { name: "Spurs", short: "TOT", code: 6 },
  19: { name: "West Ham", short: "WHU", code: 21 },
  20: { name: "Wolves", short: "WOL", code: 39 },
};
