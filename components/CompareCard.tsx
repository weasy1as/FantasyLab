"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Player } from "@/types/player";
import { positions } from "@/lib/utils";
import PlayerImage from "./PlayerImage";
import { getPlayerImg } from "@/lib/fpl";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── shared types ──────────────────────────────────────────────────────────────

export interface StatRow {
  label: string;
  keyA: keyof Player;
  format?: (v: number | string) => string;
  higherIsBetter?: boolean;
}

export const COMPARE_STATS: StatRow[] = [
  {
    label: "Price",
    keyA: "now_cost",
    format: (v) => `£${(Number(v) / 10).toFixed(1)}m`,
    higherIsBetter: false,
  },
  { label: "Total Points", keyA: "total_points", higherIsBetter: true },
  { label: "PPG", keyA: "points_per_game", higherIsBetter: true },
  { label: "Form", keyA: "form", higherIsBetter: true },
  { label: "Goals", keyA: "goals_scored", higherIsBetter: true },
  { label: "Assists", keyA: "assists", higherIsBetter: true },
  { label: "Clean Sheets", keyA: "clean_sheets", higherIsBetter: true },
  { label: "Minutes", keyA: "minutes", higherIsBetter: true },
  { label: "Bonus", keyA: "bonus", higherIsBetter: true },
  {
    label: "Selected %",
    keyA: "selected_by_percent",
    format: (v) => `${v}%`,
    higherIsBetter: true,
  },
  { label: "BPS", keyA: "bps", higherIsBetter: true },
];

// ── helpers ───────────────────────────────────────────────────────────────────

const statusMap = {
  a: { color: "bg-emerald-400", label: "Available" },
  d: { color: "bg-yellow-400", label: "Doubtful" },
  i: { color: "bg-red-500", label: "Injured" },
  s: { color: "bg-red-500", label: "Suspended" },
  u: { color: "bg-neutral-500", label: "Unavailable" },
} as const;

// ── CompareCard ───────────────────────────────────────────────────────────────

interface Props {
  player: Player;
  opponent: Player | null;
  /** "left" uses indigo accent, "right" uses pink accent */
  side: "left" | "right";
}

export function CompareCard({ player, opponent, side }: Props) {
  const position = positions[player.element_type];
  const status =
    statusMap[player.status as keyof typeof statusMap] ?? statusMap.u;
  const accentGradient =
    side === "left"
      ? "from-indigo-500 via-purple-500 to-pink-500"
      : "from-pink-500 via-fuchsia-500 to-indigo-500";
  const badgeGradient =
    side === "left"
      ? "from-indigo-500 to-purple-600"
      : "from-pink-500 to-fuchsia-600";

  return (
    <div className="flex flex-col bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl h-full">
      {/* Accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentGradient}`} />

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-500">
            {player.first_name}
          </p>
          <h3 className="text-2xl font-black text-neutral-100 leading-none tracking-tight">
            {player.web_name}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge
            className={`bg-gradient-to-r ${badgeGradient} text-white border-0 text-[10px] uppercase tracking-widest px-2.5`}
          >
            {position}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className="text-[10px] text-neutral-500">{status.label}</span>
          </div>
        </div>
      </div>

      {/* Player image */}
      <div className="relative flex justify-center px-5 pb-3">
        <div className="relative rounded-xl overflow-hidden bg-neutral-800 w-full flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent z-10" />
          <PlayerImage
            src={getPlayerImg(player.photo)}
            alt={player.web_name}
            width={110}
            height={120}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-5 flex-1 space-y-1">
        <Separator className="bg-neutral-800 mb-3" />
        {COMPARE_STATS.map((row) => {
          const raw = player[row.keyA];
          const val = row.format
            ? row.format(raw as string | number)
            : String(raw);
          const opponentRaw = opponent ? Number(opponent[row.keyA]) : null;
          const myRaw = Number(raw);

          let winner: "me" | "them" | "tie" | null = null;
          if (
            opponent &&
            !isNaN(myRaw) &&
            opponentRaw !== null &&
            !isNaN(opponentRaw)
          ) {
            if (myRaw === opponentRaw) winner = "tie";
            else if (row.higherIsBetter !== false)
              winner = myRaw > opponentRaw ? "me" : "them";
            else winner = myRaw < opponentRaw ? "me" : "them";
          }

          const isWinning = winner === "me";
          const isTie = winner === "tie";

          return (
            <div
              key={row.label}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${isWinning ? "bg-emerald-500/8" : ""}`}
            >
              <span className="text-[11px] uppercase tracking-widest text-neutral-500">
                {row.label}
              </span>
              <div className="flex items-center gap-1.5">
                {isWinning && (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                )}
                {winner === "them" && (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                {isTie && <Minus className="w-3 h-3 text-neutral-600" />}
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isWinning
                      ? "text-emerald-400"
                      : winner === "them"
                        ? "text-red-400"
                        : "text-neutral-100"
                  }`}
                >
                  {val}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
